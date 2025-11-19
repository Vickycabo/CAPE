import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inquiry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry-form.html',
  styleUrl: './inquiry-form.css'
})
export class InquiryForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected successMessage = signal('');
  protected errorMessage = signal('');

  vehicleId = input.required<string>();

  protected inquiryForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    message: ['', Validators.required]
  });

  onSubmit() {
    if (this.inquiryForm.valid) {
      const consulta = {
        ...this.inquiryForm.value,
        vehicleId: this.vehicleId(),
        date: new Date().toISOString().split('T')[0],
        status: 'pendiente'
      };

      this.http.post('http://localhost:3000/consultas', consulta).subscribe({
        next: () => {
          this.successMessage.set('Consulta enviada exitosamente');
          this.inquiryForm.reset();
        },
        error: () => {
          this.errorMessage.set('Error al enviar la consulta');
        }
      });
    }
  }
}
