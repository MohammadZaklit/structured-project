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

      { path: '**', redirectTo: 'login' },
    ],
  },
];
