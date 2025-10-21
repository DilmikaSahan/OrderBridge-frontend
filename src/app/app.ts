import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeycloakService } from './core/services/keycloak';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  protected readonly title = signal('order-bridge-frontend');
  private router = inject(Router);

  constructor(public keycloak: KeycloakService) {
    this.redirectAfterLogin();
  }

  redirectAfterLogin() {
    const roles = this.keycloak.getRoles();
    if (roles.includes('admin')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('user')) {
      this.router.navigate(['/user']);
    }
  }

  logout() {
    this.keycloak.logout();
  }
}