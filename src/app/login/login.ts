import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, AppUser } from '../auth-service';
import { firstValueFrom } from 'rxjs';
import { LoginFormData, RegisterFormData } from '../types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  
  protected errorMessage = signal('');
  protected showRegister = signal(false);
  protected loading = signal(false);

  protected loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password }: LoginFormData = this.loginForm.value as LoginFormData;
      
      this.loading.set(true);
      this.errorMessage.set('');
      
      try {
        // Buscar el usuario en la base de datos usando firstValueFrom
        const users: AppUser[] = await firstValueFrom(
          this.http.get<AppUser[]>('http://localhost:3000/usuarios', {
            params: { email: email || '' }
          })
        );
        
        const user: AppUser | undefined = users?.find(u => u.email === email && u.password === password);
        if (user) {
          // Login exitoso
          this.auth.setCurrentUser(user);
          this.router.navigate(['/catalogo']);
        } else {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        }
      } catch (error) {
        this.errorMessage.set('Error al intentar iniciar sesión');
      } finally {
        this.loading.set(false);
      }
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) return;
    const { name, email, password }: RegisterFormData = this.registerForm.getRawValue() as RegisterFormData;
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    try {
      // Verificar email duplicado
      const exists: boolean = await this.auth.emailExists(email);
      if (exists) {
        this.errorMessage.set('Ese email ya está registrado');
      } else {
        const user: AppUser | undefined = await this.auth.createUser({ name, email, password });
        this.loginForm.reset();
        this.showRegister.set(false);   // vuelve a modo login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.errorMessage.set('Error al registrar usuario');
    } finally {
      this.loading.set(false);
    }
  }

  toggleRegister() {
    this.showRegister.set(!this.showRegister());
  }
}
