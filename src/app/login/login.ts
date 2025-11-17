import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service';

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
      const { email, password } = this.loginForm.value;
      
      // Buscar el usuario en la base de datos
      this.http.get<any[]>('http://localhost:3000/usuarios', {
        params: { email: email || '' }
      }).subscribe({
        next: (users) => {
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            // Login exitoso
            this.auth.setCurrentUser(user);
            this.router.navigate(['/catalogo']);
          } else {
            this.errorMessage.set('Usuario o contraseña incorrectos');
          }
        },
        error: () => {
          this.errorMessage.set('Error al intentar iniciar sesión');
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    const { name, email, password } = this.registerForm.getRawValue();
    // Verificar email duplicado y crear
    this.auth.emailExists(email!).subscribe(exists => {
      if (exists) {
        this.errorMessage.set('Ese email ya está registrado');
      } else {
        this.auth.createUser({ name: name!, email: email!, password: password! }).subscribe(user => {
          // Ingresar automáticamente tras registrar
          this.auth.setCurrentUser(user);
          this.router.navigate(['/catalogo']);
        });
      }
    });
  }

  toggleRegister() {
    this.showRegister.set(!this.showRegister());
  }
}
