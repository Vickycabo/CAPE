import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Inquiry } from './inquiry';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/consultas';
  
  // Signals para manejo de estado
  private readonly inquiries = signal<Inquiry[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  
  // Computed signals
  readonly inquiriesComputed = computed(() => this.inquiries());
  readonly isLoadingComputed = computed(() => this.loading());
  readonly errorComputed = computed(() => this.error());

  async getInquiries(): Promise<Inquiry[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const inquiries = await firstValueFrom(this.http.get<Inquiry[]>(this.baseUrl));
      this.inquiries.set(inquiries || []);
      return this.inquiries();
    } catch (err) {
      this.error.set('Error cargando consultas');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async updateInquiryStatus(id: string | number, status: string): Promise<Inquiry | null> {
    try {
      const updatedInquiry = await firstValueFrom(this.http.patch<Inquiry>(`${this.baseUrl}/${id}`, { status }));
      if (updatedInquiry) {
        this.inquiries.update(inquiries => 
          inquiries.map(i => i.id == id ? updatedInquiry : i)
        );
      }
      return updatedInquiry || null;
    } catch (err) {
      this.error.set('Error actualizando estado');
      throw err;
    }
  }

  async addInquiry(inquiry: Inquiry): Promise<Inquiry | null> {
    try {
      const newInquiry = await firstValueFrom(this.http.post<Inquiry>(this.baseUrl, inquiry));
      if (newInquiry) {
        this.inquiries.update(inquiries => [...inquiries, newInquiry]);
      }
      return newInquiry || null;
    } catch (err) {
      this.error.set('Error creando consulta');
      throw err;
    }
  }

  async deleteInquiry(id: string | number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
      this.inquiries.update(inquiries => inquiries.filter(i => i.id != id));
    } catch (err) {
      this.error.set('Error eliminando consulta');
      throw err;
    }
  }
  
}
