import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private user = { email: 'admin@admin.com', password: '1234' };
  private logueado = false;

  login(email: string, password: string): Observable<boolean> {
    this.logueado = (email === this.user.email && password === this.user.password);
    return new Observable(observer => {
      observer.next(this.logueado);
      observer.complete();
    });
  }

  logout() {
    this.logueado = false;
  }

  isLoggedIn() {
    return this.logueado;
  }
}
