import { Routes } from '@angular/router';
import { ModuleSettingsService } from '../../../shared/services/module-settings.service';

export const AUTH_PAGE_ROUTES: Routes = [
  {
    path: 'auth-login',
    providers: [ModuleSettingsService],
    loadComponent: () => import('../components/auth-login/auth-login').then((m) => m.AuthLogin),
  },
  {
    path: 'auth-register',
    providers: [ModuleSettingsService],
    loadComponent: () =>
      import('../components/auth-register/auth-register').then((m) => m.Authregister),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
