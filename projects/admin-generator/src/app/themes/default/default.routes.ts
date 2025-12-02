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
      { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') }, // for all UI components
      { path: 'documentation', component: Documentation }, // for documentation page
      { path: 'pages', loadChildren: () => import('./pages/pages.routes') }, // for crud page
    ],
  },
  {
    path: 'auth-login',
    loadComponent: () =>
      import('../../features/auth/components/auth-login/auth-login').then((m) => m.AuthLogin),
  },
  {
    path: 'auth-register',
    loadComponent: () =>
      import('../../features/auth/components/auth-register/auth-register').then(
        (m) => m.Authregister,
      ),
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('../../features/auth/components/edit-profile/edit-profile').then((m) => m.EditProfile),
  },
  { path: 'landing', component: Landing }, // for landing page
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') }, //for all auth components
  { path: '**', redirectTo: '/404' }, // else not found
];
