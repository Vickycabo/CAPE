import { Component, inject } from '@angular/core';
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
  protected successMessage = '';
  protected errorMessage = '';

  protected inquiryForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    mensaje: ['', Validators.required]
  });

  onSubmit() {
    if (this.inquiryForm.valid) {
      const consulta = {
        ...this.inquiryForm.value,
        fecha: new Date(),
        estado: 'pendiente'
      };

      this.http.post('http://localhost:3000/consultas', consulta).subscribe({
        next: () => {
          this.successMessage = 'Consulta enviada exitosamente';
          this.inquiryForm.reset();
        },
        error: () => {
          this.errorMessage = 'Error al enviar la consulta';
        }
      });
    }
  }
}
