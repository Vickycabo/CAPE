import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  protected readonly isAdmin = computed(() => this.auth.isAdmin());
  protected readonly currentUserName = computed(() => this.auth.getUser()?.name || '');

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}