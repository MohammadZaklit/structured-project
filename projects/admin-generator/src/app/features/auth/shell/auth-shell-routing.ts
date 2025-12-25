import { Routes } from '@angular/router';

export const AUTH_PAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('../components/auth-login/auth-login').then((m) => m.AuthLogin),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../components/auth-register/auth-register').then((m) => m.Authregister),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('../components/auth-forgot-password/auth-forgot-password').then(
            (m) => m.AuthForgotPassword,
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./reset-password-router').then((m) => m.ResetPasswordRouteComponent),
      },
      { path: '**', redirectTo: 'login' },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
