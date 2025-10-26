import { Routes } from '@angular/router';

import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () => import('./pages/notfound/notfound').then((m) => m.Notfound),
  },
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Dashboard },
      {
        path: 'admin',
        loadChildren: () =>
          import('../../features/admin/shell/admin-page-shell.routing').then(
            (m) => m.ADMIN_PAGE_ROUTES,
          ),
      },
      { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
      { path: 'documentation', component: Documentation },
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') },
    ],
  },
  { path: 'landing', component: Landing },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
  { path: '**', redirectTo: '/404' },
];
