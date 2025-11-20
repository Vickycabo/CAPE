import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Inquiry } from './inquiry';


@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  private readonly http = inject(HttpClient);
   private readonly baseUrl = 'http://localhost:3000/consultas';

  getInquiries() {
      return this.http.get<Inquiry[]>(this.baseUrl);
    }

  updateInquiryStatus(id: string | number, status: string) {
    return this.http.patch<Inquiry>(`${this.baseUrl}/${id}`, { status });
  }

  addInquiry(inquiry: Inquiry) {
    return this.http.post<Inquiry>(this.baseUrl, inquiry);
  }

  deleteInquiry(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
