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
  protected auth = inject(AuthService);

  protected usuarios = signal<AppUser[]>([]); //señal para el cambio de rol
  protected cargando = signal(true);
  protected error = signal('');
  protected cambiosPendientes = new Map<number, 'admin' | 'usuario'>(); // userId -> nuevo rol
  protected hayCambios = signal(false);

  ngOnInit() {
    this.cargarUsuarios();
  }



  async cargarUsuarios() {
    this.cargando.set(true);
    try {
      const users = await this.auth.listUsers();
      this.usuarios.set(users);
    } catch (err) {
      this.error.set('Error cargando usuarios');
    } finally {
      this.cargando.set(false);
    }
  }



  cambiarRol(usuario: AppUser, nuevoRol: 'admin' | 'usuario') {
    if (!usuario.id) return;
    
    // Guardar el cambio pendiente
    this.cambiosPendientes.set(usuario.id, nuevoRol);
    this.hayCambios.set(this.cambiosPendientes.size > 0);
  }

  getRolActual(usuario: AppUser): 'admin' | 'usuario' {
    if (!usuario.id) return usuario.rol;
    return this.cambiosPendientes.get(usuario.id) || usuario.rol;
  }

  onRolChange(usuario: AppUser, event: Event) {
    // Verificar que no sea el usuario actual
    const usuarioActual = this.auth.getUser();
    if (usuarioActual && usuarioActual.id === usuario.id) {
      // Restaurar el valor original si intentan cambiar su propio rol
      const target = event.target as HTMLSelectElement;
      target.value = usuario.rol;
      alert('No puedes cambiar tu propio rol');
      return;
    }

    const target = event.target as HTMLSelectElement;
    const nuevoRol = target.value as 'admin' | 'usuario';
    this.cambiarRol(usuario, nuevoRol);
  }

  async guardarCambios() {
    if (this.cambiosPendientes.size === 0) return;

    const cambios = Array.from(this.cambiosPendientes.entries());
    
    try {
      // Procesar todos los cambios en paralelo
      await Promise.all(
        cambios.map(([userId, nuevoRol]) => 
          this.auth.updateUserRole(userId, nuevoRol)
        )
      );
      
      // Todos los cambios completados
      this.cambiosPendientes.clear();
      this.hayCambios.set(false);
      await this.cargarUsuarios();
    } catch (err) {
      this.error.set('Error guardando algunos cambios');
    }
  }



  async eliminarUsuario(usuario: AppUser) {
    if (!usuario.id) return;
    
    // Verificar que no sea el usuario actual
    const usuarioActual = this.auth.getUser();
    if (usuarioActual && usuarioActual.id === usuario.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${usuario.name}?`)) {
      try {
        await this.auth.deleteUser(usuario.id);
        // Remover cambios pendientes si los había
        this.cambiosPendientes.delete(usuario.id);
        this.hayCambios.set(this.cambiosPendientes.size > 0);
        // Actualizar la lista de usuarios
        await this.cargarUsuarios();
      } catch (err) {
        this.error.set('Error eliminando usuario');
      }
    }
  }

}
