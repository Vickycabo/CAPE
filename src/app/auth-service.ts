import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<AppUser | null>(null);
  private readonly http = inject(HttpClient);
  private readonly usersUrl = 'http://localhost:3000/usuarios';

  constructor() {
    // Restaurar sesión desde localStorage si existe
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      try { this.currentUser.set(JSON.parse(raw)); } catch {}
    }
  }

  // Signals para manejo de estado
  private readonly users = signal<AppUser[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  
  // Computed signals
  readonly usersComputed = computed(() => this.users());
  readonly isLoadingComputed = computed(() => this.loading());
  readonly errorComputed = computed(() => this.error());

  setCurrentUser(user: AppUser) {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  isAdmin() {
    return this.currentUser()?.rol === 'admin';
  }

  getUser() {
    return this.currentUser();
  }

  // Users API con Signals
  async listUsers() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const users = await firstValueFrom(this.http.get<AppUser[]>(this.usersUrl));
      this.users.set(users || []);
      return this.users();
    } catch (err) {
      this.error.set('Error cargando usuarios');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async createUser(user: Omit<AppUser, 'id'|'rol'> & { rol?: AppUser['rol'] }) {
    const payload = { ...user, rol: user.rol ?? 'usuario' } as Omit<AppUser,'id'>;
    try {
      const newUser = await firstValueFrom(this.http.post<AppUser>(this.usersUrl, payload));
      if (newUser) {
        this.users.update(users => [...users, newUser]);
      }
      return newUser;
    } catch (err) {
      this.error.set('Error creando usuario');
      throw err;
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const users = await firstValueFrom(this.http.get<AppUser[]>(this.usersUrl, { params: { email } }));
      return (users?.length || 0) > 0;
    } catch (err) {
      this.error.set('Error verificando email');
      return false;
    }
  }

  async updateUserRole(id: number, rol: AppUser['rol']): Promise<AppUser | null> {
    try {
      const updatedUser = await firstValueFrom(this.http.patch<AppUser>(`${this.usersUrl}/${id}`, { rol }));
      if (updatedUser) {
        this.users.update(users => 
          users.map(u => u.id === updatedUser.id ? updatedUser : u)
        );
        // Si es el usuario actual, actualizar también
        if (this.currentUser()?.id === updatedUser.id) {
          this.setCurrentUser(updatedUser);
        }
      }
      return updatedUser || null;
    } catch (err) {
      this.error.set('Error actualizando rol');
      throw err;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.usersUrl}/${id}`));
      this.users.update(users => users.filter(u => u.id !== id));
    } catch (err) {
      this.error.set('Error eliminando usuario');
      throw err;
    }
  }
}
