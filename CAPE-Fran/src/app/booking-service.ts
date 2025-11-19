import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Booking } from './booking';


@Injectable({
  providedIn: 'root',
})
export class BookingService {

private readonly http = inject(HttpClient);
private readonly baseUrl = 'http://localhost:3000/reservas';

   getBookings() {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  // getBookingById(id: string | number) {
  //   return this.http.get<Booking>(`${this.baseUrl}/${id}`);
  // }

  // addBooking(booking: Booking) {
  //   return this.http.post<Booking>(this.baseUrl, booking);
  // }

  // updateBooking(booking: Booking, id: string | number) {
  //   return this.http.put<Booking>(`${this.baseUrl}/${id}`, booking);
  // }

  // deleteBooking(id: string | number) {
  //   return this.http.delete(`${this.baseUrl}/${id}`);
  // }

}



