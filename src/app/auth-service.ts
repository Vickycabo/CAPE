import { Injectable, signal, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  // Compatibilidad: método login booleano (no usado por el flujo actual)
  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      observer.next(false);
      observer.complete();
    });
  }

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

  // Users API
  listUsers() {
    return this.http.get<AppUser[]>(this.usersUrl);
  }

  createUser(user: Omit<AppUser, 'id'|'rol'> & { rol?: AppUser['rol'] }) {
    const payload = { ...user, rol: user.rol ?? 'usuario' } as Omit<AppUser,'id'>;
    return this.http.post<AppUser>(this.usersUrl, payload);
  }

  emailExists(email: string) {
    return this.http.get<AppUser[]>(this.usersUrl, { params: { email } }).pipe(map(arr => arr.length > 0));
  }

  updateUserRole(id: number, rol: AppUser['rol']) {
    return this.http.patch<AppUser>(`${this.usersUrl}/${id}`, { rol });
  }
}
