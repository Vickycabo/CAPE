import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

 private apiUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) {}

  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addReserva(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

