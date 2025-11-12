import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service';

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
  private auth = inject(AuthService);

  vehicleId = input.required<string | number>();

  protected successMessage = signal('');
  protected errorMessage = signal('');

  protected bookingForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required]
  });

  onSubmit() {
    if (this.bookingForm.valid) {
      const user = this.auth.getUser();
      const reserva = {
        ...this.bookingForm.value,
        vehiculoId: this.vehicleId(),
        usuarioId: user?.id,
        fechaCreacion: new Date(),
        estado: 'pendiente'
      };

      this.http.post('http://localhost:3000/reservas', reserva).subscribe({
        next: () => {
          this.successMessage.set('Reserva realizada exitosamente');
          this.bookingForm.reset();
        },
        error: () => {
          this.errorMessage.set('Error al realizar la reserva');
        }
      });
    }
  }
}
