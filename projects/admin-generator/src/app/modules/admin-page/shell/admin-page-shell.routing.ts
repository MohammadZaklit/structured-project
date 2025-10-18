import { Routes } from '@angular/router';
import { AdminPageResolver } from './admin-page.resolver';
import { ModuleSettingsService } from '../../../shared/services/module-settings.service';

export const ADMIN_PAGE_ROUTES: Routes = [
  {
    path: ':module',
    providers: [ModuleSettingsService],
    resolve: { config: AdminPageResolver },
    loadComponent: () => import('../shell/admin-page.component').then((m) => m.AdminPageComponent),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('../components/admin-page-listing/admin-page-listing').then(
            (m) => m.AdminPageListing
          ),
      },
      {
        path: 'form',
        loadComponent: () =>
          import('../components/admin-page-form/admin-page-form').then((m) => m.AdminPageForm),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../components/admin-page-form/admin-page-form').then((m) => m.AdminPageForm),
      },
      {
        path: 'view',
        loadComponent: () =>
          import('../components/admin-page-view/admin-page-view').then((m) => m.AdminPageView),
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
