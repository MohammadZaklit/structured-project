import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
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
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation(),
    ),
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
