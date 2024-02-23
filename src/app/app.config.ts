import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AllControlsService } from './services/controls/all-controls.service';
import { CONTROLS_SERVICE_TOKEN } from './services/controls/controls.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: CONTROLS_SERVICE_TOKEN, useClass: AllControlsService },
  ],
};
