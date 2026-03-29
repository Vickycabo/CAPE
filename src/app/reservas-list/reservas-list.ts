import { Component, inject, signal, computed } from '@angular/core';
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

  protected reservas = signal<Booking[]>([]);
  protected vehiculos = signal<Vehicle[]>([]);
  protected cargando = signal(true);
  protected error = signal('');

  // Computed signals para acceso reactivo
  protected reservasComputed = computed(() => this.reservas());
  protected vehiculosComputed = computed(() => this.vehiculos());

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando.set(true);
    this.error.set('');
    
    try {
      // Cargar vehículos y reservas en paralelo usando signals
      const [vehiculos, reservas] = await Promise.all([
        this.vehicleClient.getVehicles(),
        this.bookingService.getBookings()
      ]);
      
      this.vehiculos.set(vehiculos);
      this.reservas.set(reservas);
    } catch (err) {
      this.error.set('Error cargando los datos');
    } finally {
      this.cargando.set(false);
    }
  }

  getVehicleInfo(vehicleId: string | number | undefined): string {
    if (!vehicleId) return 'Vehículo no especificado';
    const vehicle = this.vehiculos().find(v => v.id == vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : `Vehículo ID: ${vehicleId}`;
  }

  getVehicleImage(vehicleId: string | number | undefined): string {
    if (!vehicleId) return '';
    const vehicle = this.vehiculos().find(v => v.id == vehicleId);
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

  async eliminarReserva(reserva: Booking) {
    if (!reserva.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la reserva de ${reserva.name}?`)) {
      try {
        await this.bookingService.deleteBooking(reserva.id);
        this.reservas.update(reservas => reservas.filter(r => r.id !== reserva.id));
      } catch (err) {
        alert('Error al eliminar la reserva');
      }
    }
  }
}