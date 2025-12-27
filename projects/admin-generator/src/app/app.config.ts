import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { createRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  NzHttpErrorInterceptor,
  NzhttpLoaderInterceptor,
  provideNzBaseConfig,
} from '@zak-lib/ui-library/shared';
import { environment } from './environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { NzAuthInterceptor } from '@zak-lib/ui-library/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(createRoutes(), withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([NzAuthInterceptor, NzhttpLoaderInterceptor, NzHttpErrorInterceptor]),
    ),
    provideNzBaseConfig({
      apiBaseUrl: environment.apiUrl,
    }),
    DialogService,
  ],
};
