import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: KeycloakInstance = new Keycloak({
    url: 'http://localhost:8080/', 
    realm: 'OrderBrideg_realm',   
    clientId: 'OrderBridge_frontend_client', 
  });

  async init(): Promise<boolean> {
    try {
      await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256', // modern, secure
      });
      return true;
    } catch (err) {
      console.error('Keycloak init failed', err);
      return false;
    }
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  getProfile(): any {
    return this.keycloak.tokenParsed;
  }

  getRoles(): string[] {
    return this.keycloak.realmAccess?.roles ?? [];
  }
}