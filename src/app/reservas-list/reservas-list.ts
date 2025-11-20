import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../booking-service';
import { VehicleClient } from '../vehicle-client';
import { Booking } from '../booking';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-reservas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-list.html',
  styleUrl: './reservas-list.css'
})
export class ReservasList {
  private bookingService = inject(BookingService);
  private vehicleClient = inject(VehicleClient);

  protected reservas: Booking[] = [];
  protected vehiculos: Vehicle[] = [];
  protected cargando = signal(true);
  protected error = signal('');

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    
    // Cargar vehículos y reservas en paralelo
    Promise.all([
      this.vehicleClient.getVehicles().toPromise(),
      this.bookingService.getBookings().toPromise()
    ]).then(([vehiculos, reservas]) => {
      this.vehiculos = vehiculos || [];
      this.reservas = reservas || [];
      this.cargando.set(false);
    }).catch(() => {
      this.error.set('Error cargando los datos');
      this.cargando.set(false);
    });
  }

  getVehicleInfo(vehicleId: string | number | undefined): string {
    if (!vehicleId) return 'Vehículo no especificado';
    const vehicle = this.vehiculos.find(v => v.id == vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : `Vehículo ID: ${vehicleId}`;
  }

  getVehicleImage(vehicleId: string | number | undefined): string {
    if (!vehicleId) return '';
    const vehicle = this.vehiculos.find(v => v.id == vehicleId);
    return vehicle && vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Fecha no especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  eliminarReserva(reserva: Booking) {
    if (!reserva.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la reserva de ${reserva.name}?`)) {
      this.bookingService.deleteBooking(reserva.id).subscribe({
        next: () => {
          this.reservas = this.reservas.filter(r => r.id !== reserva.id);
        },
        error: () => {
          alert('Error al eliminar la reserva');
        }
      });
    }
  }
}