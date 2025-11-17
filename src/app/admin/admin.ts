import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AppUser } from '../auth-service';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../booking-service';
import { InquiryService } from '../inquiry-service';
import { Booking } from '../booking';
import { Inquiry } from '../inquiry';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private auth = inject(AuthService);
  private bookingService = inject(BookingService);
  private inquiryService = inject(InquiryService);

  protected usuarios: AppUser[] = [];
  protected reservas: Booking[] = [];
  protected consultas: Inquiry[] = [];

  protected vistaActual = signal('usuarios');
  protected cargando = signal(true);
  protected error = signal('');

  ngOnInit() {
    this.cargarUsuarios();
  }

  mostrarUsuarios() {
    this.vistaActual.set('usuarios');
    this.cargarUsuarios();
  }

  mostrarReservas() {
    this.vistaActual.set('reservas');
    this.cargarReservas();
  }

  mostrarConsultas() {
    this.vistaActual.set('consultas');
    this.cargarConsultas();
  }

  cargarUsuarios() {
    this.cargando.set(true);
    this.auth.listUsers().subscribe({
      next: users => {
        this.usuarios = users;
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error cargando usuarios');
        this.cargando.set(false);
      }
    });
  }

  cargarReservas() {
    this.cargando.set(true);
    this.bookingService.getBookings().subscribe({
      next: bookings => {
        this.reservas = bookings;
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error cargando reservas');
        this.cargando.set(false);
      }
    });
  }

  cargarConsultas() {
    this.cargando.set(true);
    this.inquiryService.getInquiries().subscribe({
      next: inquiries => {
        this.consultas = inquiries;
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error cargando consultas');
        this.cargando.set(false);
      }
    });
  }

  cambiarRol(user: AppUser, nuevoRol: AppUser['rol']) {
    if (user.rol === nuevoRol) return;
    this.auth.updateUserRole(user.id, nuevoRol).subscribe({
      next: updated => {
        const idx = this.usuarios.findIndex(u => u.id === updated.id);
        if (idx >= 0) this.usuarios[idx] = updated;

        // Si el usuario modificado es el actual, actualizar la sesión
        const currentUser = this.auth.getUser();
        if (currentUser && currentUser.id === updated.id) {
          this.auth.setCurrentUser(updated);
        }
      },
      error: () => alert('Error actualizando rol')
    });
  }

  cambiarEstado(consulta: Inquiry, nuevoEstado: string) {
    if (!consulta.id) return;
    this.inquiryService.updateInquiryStatus(consulta.id, nuevoEstado).subscribe({
      next: updated => {
        const idx = this.consultas.findIndex(c => c.id === updated.id);
        if (idx >= 0) {
          this.consultas[idx] = updated;
        }
      },
      error: () => alert('Error actualizando estado')
    });
  }

}
