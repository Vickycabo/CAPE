import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService, AppUser } from '../auth-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingFormData, Booking } from '../types';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm implements OnInit {
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

  ngOnInit() {
    // Prellenar formulario si el usuario está logueado
    const currentUser: AppUser | null = this.auth.getUser();
    if (currentUser) {
      this.bookingForm.patchValue({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }

  async onSubmit() {
    if (this.bookingForm.valid) {
      const user: AppUser | null = this.auth.getUser();
      const formData: BookingFormData = this.bookingForm.value as BookingFormData;
      const reserva: Omit<Booking, 'id'> = {
        ...formData,
        vehicleId: this.vehicleId(),
        userId: user?.id || ''
      };

      try {
        await firstValueFrom(this.http.post<Booking>('http://localhost:3000/reservas', reserva));
        this.successMessage.set('Reserva realizada exitosamente');
        this.errorMessage.set('');
        this.bookingForm.reset();
        this.router.navigate(['/catalogo']);
      } catch (error) {
        this.errorMessage.set('Error al realizar la reserva');
        this.successMessage.set('');
      }
    }
  }
}
