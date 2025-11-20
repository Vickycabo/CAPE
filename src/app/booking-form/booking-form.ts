import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  vehicleId = input.required<string | number>();

  protected successMessage = signal('');
  protected errorMessage = signal('');


// Que tome la fecha actual fromateada para prevenir "fecha de visita" en fechas pasadas
  protected readonly today = new Date().toISOString().split('T')[0]; 

  protected bookingForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    date: ['', Validators.required]
  });

  onSubmit() {
    if (this.bookingForm.valid) {
      const user = this.auth.getUser();
      const reserva = {
        ...this.bookingForm.value,
        vehicleId: this.vehicleId(),
        userId: user?.id
      };

      this.http.post('http://localhost:3000/reservas', reserva).subscribe({
        next: () => {
          this.successMessage.set('Reserva realizada exitosamente');
          this.bookingForm.reset();
          this.router.navigate(['/catalogo']);
        },
        error: () => {
          this.errorMessage.set('Error al realizar la reserva');
        }
      });
    }
  }
}
