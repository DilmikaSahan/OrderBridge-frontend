import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { KeycloakService } from './app/core/services/keycloak';
import { appConfig } from './app/app.config';

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  bootstrapApplication(App, {
    providers: [
      ...appConfig.providers,
      { provide: KeycloakService, useValue: keycloakService }
    ]
  });
});