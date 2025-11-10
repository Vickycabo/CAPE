import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AppUser } from '../auth-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private auth = inject(AuthService);
  protected usuarios: AppUser[] = [];
  protected cargando = signal(true);
  protected error = signal('');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.auth.listUsers().subscribe({
      next: users => { this.usuarios = users; this.cargando.set(false); },
      error: () => { this.error.set('Error cargando usuarios'); this.cargando.set(false); }
    });
  }

  cambiarRol(user: AppUser, nuevoRol: AppUser['rol']) {
    if (user.rol === nuevoRol) return;
    this.auth.updateUserRole(user.id, nuevoRol).subscribe({
      next: updated => {
        const idx = this.usuarios.findIndex(u => u.id === updated.id);
        if (idx >= 0) this.usuarios[idx] = updated;
      },
      error: () => alert('Error actualizando rol')
    });
  }

}
