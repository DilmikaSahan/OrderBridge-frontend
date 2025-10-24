import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak';

export const AuthGuard: CanActivateFn = () => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);
  if (keycloak.isLoggedIn()) {
    return true;
  }
  keycloak.login();
  return false;
};