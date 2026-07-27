import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Booking } from './booking';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/reservas';
  
  // Signals para manejo de estado
  private readonly bookings = signal<Booking[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  
  // Computed signals
  readonly bookingsComputed = computed(() => this.bookings());
  readonly isLoadingComputed = computed(() => this.loading());
  readonly errorComputed = computed(() => this.error());

  async getBookings(): Promise<Booking[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const bookings = await firstValueFrom(this.http.get<Booking[]>(this.baseUrl));
      this.bookings.set(bookings || []);
      return this.bookings();
    } catch (err) {
      this.error.set('Error cargando reservas');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getBookingById(id: string | number): Promise<Booking | null> {
    try {
      const booking = await firstValueFrom(this.http.get<Booking>(`${this.baseUrl}/${id}`));
      return booking || null;
    } catch (err) {
      this.error.set('Error cargando reserva');
      return null;
    }
  }

  async addBooking(booking: Booking): Promise<Booking | null> {
    try {
      const newBooking = await firstValueFrom(this.http.post<Booking>(this.baseUrl, booking));
      if (newBooking) {
        this.bookings.update(bookings => [...bookings, newBooking]);
      }
      return newBooking || null;
    } catch (err) {
      this.error.set('Error creando reserva');
      throw err;
    }
  }

  async deleteBooking(id: string | number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
      this.bookings.update(bookings => bookings.filter(b => b.id != id));
    } catch (err) {
      this.error.set('Error eliminando reserva');
      throw err;
    }
  }

  async updateBooking(booking: Booking, id: string | number): Promise<Booking | null> {
    try {
      const updatedBooking = await firstValueFrom(this.http.put<Booking>(`${this.baseUrl}/${id}`, booking));
      if (updatedBooking) {
        this.bookings.update(bookings => 
          bookings.map(b => b.id == id ? updatedBooking : b)
        );
      }
      return updatedBooking || null;
    } catch (err) {
      this.error.set('Error actualizando reserva');
      throw err;
    }
  }

}



