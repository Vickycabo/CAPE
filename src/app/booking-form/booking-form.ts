import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected successMessage = '';
  protected errorMessage = '';

  protected bookingForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required]
  });

  onSubmit() {
    if (this.bookingForm.valid) {
      const reserva = {
        ...this.bookingForm.value,
        fechaCreacion: new Date(),
        estado: 'pendiente'
      };

      this.http.post('http://localhost:3000/reservas', reserva).subscribe({
        next: () => {
          this.successMessage = 'Reserva realizada exitosamente';
          this.bookingForm.reset();
        },
        error: () => {
          this.errorMessage = 'Error al realizar la reserva';
        }
      });
    }
  }
}
