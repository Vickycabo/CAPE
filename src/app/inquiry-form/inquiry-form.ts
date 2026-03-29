import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, AppUser } from '../auth-service';
import { firstValueFrom } from 'rxjs';
import { InquiryFormData, Inquiry } from '../types';

@Component({
  selector: 'app-inquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-form.html',
  styleUrl: './inquiry-form.css'
})
export class InquiryForm implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  protected successMessage = signal('');
  protected errorMessage = signal('');

  vehicleId = input.required<string>();

  protected inquiryForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    message: ['', Validators.required]
  });

  ngOnInit() {
    // Prellenar formulario si el usuario está logueado
    const currentUser: AppUser | null = this.auth.getUser();
    if (currentUser) {
      this.inquiryForm.patchValue({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }

  async onSubmit() {
    if (this.inquiryForm.valid) {
      const formData: InquiryFormData = this.inquiryForm.value as InquiryFormData;
      const consulta: Omit<Inquiry, 'id'> = {
        ...formData,
        vehicleId: this.vehicleId(),
        date: new Date().toISOString().split('T')[0],
        status: 'pendiente' as const
      };

      try {
        await firstValueFrom(this.http.post<Inquiry>('http://localhost:3000/consultas', consulta));
        this.successMessage.set('Consulta enviada exitosamente');
        this.errorMessage.set('');
        this.inquiryForm.reset();
        this.router.navigate(['/catalogo']);
      } catch (error) {
        this.errorMessage.set('Error al enviar la consulta');
        this.successMessage.set('');
      }
    }
  }
}
