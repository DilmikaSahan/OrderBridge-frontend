import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak';
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  canActivate(): boolean {
    const roles = this.keycloak.getRoles();
    if (roles.includes('admin')) {
      return true;
    }
    this.router.navigate(['/user']);
    return false;
  }
}