import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {

   private apiUrl = 'http://localhost:3000/consultas';

  constructor(private http: HttpClient) {}

  getConsultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addConsulta(consulta: any): Observable<any> {
    return this.http.post(this.apiUrl, consulta);
  }

  deleteConsulta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
