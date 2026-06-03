import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';
import { BookingService } from '../booking-service';
import { InquiryService } from '../inquiry-service';
import { VehicleClient } from '../vehicle-client';
import { Booking } from '../booking';
import { Inquiry } from '../inquiry';
import { Vehicle } from '../vehicle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css'
})
export class UserPanel implements OnInit {

  private auth = inject(AuthService);
  private bookingService = inject(BookingService);
  private inquiryService = inject(InquiryService);
  private vehicleClient = inject(VehicleClient);

  protected reservas = signal<Booking[]>([]);
  protected consultas = signal<Inquiry[]>([]);
  protected vehiculos = signal<Vehicle[]>([]);
  protected currentUser = computed(() => this.auth.getUser());

  async ngOnInit() {
    if (!this.currentUser()) return;
    
    //Info
    const [vehiculos, allBookings, allInquiries] = await Promise.all([
      this.vehicleClient.getVehicles(),
      this.bookingService.getBookings(),
      this.inquiryService.getInquiries()
    ]);

    this.vehiculos.set(vehiculos);

    // Datos de usuario logueado
    this.reservas.set(allBookings.filter(b => b.userId === this.currentUser()?.id));
    this.consultas.set(allInquiries.filter(c => c.email === this.currentUser()?.email));
  }

  getVehicleName(vehicleId: string | number | undefined): string {
    const vehicle = this.vehiculos().find(v => v.id == vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehículo eliminado';
  }

  canCancel(dateString: string | undefined): boolean {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString > today; // Solo se puede cancelar si la visita es MAÑANA o después
  }

  async cancelarReserva(reserva: Booking) {
    if (!this.canCancel(reserva.date)) {
      Swal.fire('No permitido', 'Solo puedes cancelar reservas con al menos 1 día de anticipación.', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'La concesionaria será notificada de tu cancelación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#1a1a1a',
      confirmButtonText: 'Sí, cancelar visita',
      cancelButtonText: 'Volver'
    });

    if (result.isConfirmed) {
      try {
        const updatedReserva = { ...reserva, status: 'cancelada' as const };
        await this.bookingService.updateBooking(updatedReserva, reserva.id!);
        
        // Actualizamos la vista local
        this.reservas.update(rs => rs.map(r => r.id === reserva.id ? updatedReserva : r));
        
        Swal.fire({ title: 'Cancelada', text: 'Tu reserva fue cancelada.', icon: 'success', timer: 2000, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error', 'Hubo un problema al cancelar.', 'error');
      }
    }
  }
}
