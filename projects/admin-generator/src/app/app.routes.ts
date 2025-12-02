// app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { themes } from './shared/constants/themes';

// Guards
import { GuestGuard } from './guards/guest-guard/guest-guard';
import { AuthGuard } from './guards/auth-guard/auth-guard';

export const routes: Routes = [
  {
    path: '',

    loadChildren: async () => {
      const themeService = inject(ThemeService);
      const theme = themeService.getCurrentTheme();
      const themeRoutesModule = await themes[theme];
      return themeRoutesModule.routes; // ← AuthGuard should be INSIDE that file
    },
  },

  {
    path: 'auth-login',
    loadComponent: () =>
      import('./features/auth/components/auth-login/auth-login').then((m) => m.AuthLogin),
  },

  {
    path: 'auth-register',
    loadComponent: () =>
      import('./features/auth/components/auth-register/auth-register').then((m) => m.Authregister),
  },

  { path: '**', redirectTo: 'auth-login' },
];
