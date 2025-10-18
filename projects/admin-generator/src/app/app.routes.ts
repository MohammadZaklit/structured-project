import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'admin-page', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin-page/shell/admin-page-shell.routing').then(
        (m) => m.ADMIN_PAGE_ROUTES
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
