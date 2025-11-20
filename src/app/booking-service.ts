import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Booking } from './booking';

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
      const bookings = await this.http.get<Booking[]>(this.baseUrl).toPromise();
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
      const booking = await this.http.get<Booking>(`${this.baseUrl}/${id}`).toPromise();
      return booking || null;
    } catch (err) {
      this.error.set('Error cargando reserva');
      return null;
    }
  }

  async addBooking(booking: Booking): Promise<Booking | null> {
    try {
      const newBooking = await this.http.post<Booking>(this.baseUrl, booking).toPromise();
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
      await this.http.delete(`${this.baseUrl}/${id}`).toPromise();
      this.bookings.update(bookings => bookings.filter(b => b.id != id));
    } catch (err) {
      this.error.set('Error eliminando reserva');
      throw err;
    }
  }

  async updateBooking(booking: Booking, id: string | number): Promise<Booking | null> {
    try {
      const updatedBooking = await this.http.put<Booking>(`${this.baseUrl}/${id}`, booking).toPromise();
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



