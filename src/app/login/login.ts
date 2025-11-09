import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  
  protected errorMessage = '';

  protected loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
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
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate(['/catalogo']);
          } else {
            this.errorMessage = 'Usuario o contraseña incorrectos';
          }
        },
        error: () => {
          this.errorMessage = 'Error al intentar iniciar sesión';
        }
      });
    }
  }
}
