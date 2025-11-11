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
  
    // getInquiryById(id: string | number) {
    //   return this.http.get<Inquiry>(`${this.baseUrl}/${id}`);
    // }
  
    // addInquiry(inquiry: Inquiry) {
    //   return this.http.post<Inquiry>(this.baseUrl, inquiry);
    // }
  
    // updateInquiry(inquiry: Inquiry, id: string | number) {
    //   return this.http.put<Inquiry>(`${this.baseUrl}/${id}`, inquiry);
    // }
  
    // deleteInquiry(id: string | number) {
    //   return this.http.delete(`${this.baseUrl}/${id}`);
    // }
  
}
