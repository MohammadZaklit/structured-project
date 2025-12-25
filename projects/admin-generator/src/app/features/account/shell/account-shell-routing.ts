import { Routes } from '@angular/router';

export const ACCOUNT_PAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./account-layout').then((m) => m.AccountLayoutComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('../components/account-profile/account-profile').then((m) => m.AccountProfile),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('../components/account-change-password/account-change-password').then(
            (m) => m.AccountChangePassword,
          ),
      },
      { path: '**', redirectTo: 'profile' },
    ],
  },
  { path: '**', redirectTo: 'profile' },
];
