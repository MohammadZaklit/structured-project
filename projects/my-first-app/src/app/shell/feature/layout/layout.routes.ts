import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  { path: '', redirectTo: 'account', pathMatch: 'full' },
  {
    path: 'account',
    loadComponent: () => import('../../../features/account/account').then((m) => m.Account),
  },
  {
    path: 'login',
    loadComponent: () => import('../../../features/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('../../../features/register/register').then((m) => m.Register),
  },
];
