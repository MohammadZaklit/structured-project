import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { THEMES } from './shared/constants/themes';

export const routes: Routes = [
  {
    path: '',
    loadChildren: async () => {
      // Get current theme dynamically
      const themeService = inject(ThemeService);
      const theme = themeService.getCurrentTheme(); // e.g. 'default' | 'dark'

      const themeRoutesModule = await (THEMES[theme] || THEMES['default']);
      return themeRoutesModule.routes;
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
