import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Landing } from './pages/landing/landing';
import { NzAuthGuard, NzGuestGuard } from '@zak-lib/ui-library/auth';

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./pages/notfound/notfound').then((m) => m.Notfound),
  },
  {
    path: '',
    canActivate: [NzAuthGuard],
    component: AppLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      {
        path: 'admin',
        loadChildren: () =>
          import('../../features/admin/shell/admin-page-shell.routing').then(
            (m) => m.ADMIN_PAGE_ROUTES,
          ),
      },
      { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') }, // for all UI components
      { path: 'documentation', component: Documentation }, // for documentation page
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') }, // for crud page
      {
        path: 'account',
        loadChildren: () =>
          import('../../features/account/shell/account-shell-routing').then(
            (m) => m.ACCOUNT_PAGE_ROUTES,
          ),
      },
      { path: '**', redirectTo: '/dashboard' },
    ],
  },
  { path: 'landing', component: Landing }, // for landing page
  {
    path: 'auth',
    canActivate: [NzGuestGuard],
    loadChildren: () =>
      import('../../features/auth/shell/auth-shell-routing').then((m) => m.AUTH_PAGE_ROUTES),
  },
  { path: 'auth-old', loadChildren: () => import('./pages/auth/auth.routes') }, //for all auth components
  { path: '**', redirectTo: '/404' }, // else not found
];
