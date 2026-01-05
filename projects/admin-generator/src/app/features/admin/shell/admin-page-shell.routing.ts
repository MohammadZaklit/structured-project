import { Routes } from '@angular/router';
import { AdminPageResolver } from './admin-page.resolver';
import { ModuleSettingsService } from '../services/module-settings.service';
import { BuilderFieldsMapperService } from '../services/builder-fields-mapper.service';
import { WizardFieldsMapperService } from '../services/wizard-fields-mapper.service';
import { AdminBuilderResolver } from './admin-builder.resolver';
import { BuilderSettingsService } from '../services/builder-settings.service';

export const ADMIN_PAGE_ROUTES: Routes = [
  {
    path: ':module',
    providers: [
      ModuleSettingsService,
      WizardFieldsMapperService,
      BuilderSettingsService,
      BuilderFieldsMapperService,
    ],
    resolve: { config: AdminPageResolver },
    loadComponent: () => import('../shell/admin-page.component').then((m) => m.AdminPageComponent),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('../components/admin-page-listing/admin-page-listing').then(
            (m) => m.AdminPageListing,
          ),
      },
      {
        path: 'form',
        loadComponent: () =>
          import('../components/admin-page-form/admin-page-form').then((m) => m.AdminPageForm),
      },
      {
        path: 'build/:moduleName',
        loadComponent: () =>
          import('../components/admin-page-builder/admin-page-builder').then(
            (m) => m.AdminPageBuilder,
          ),
        resolve: { config: AdminBuilderResolver },
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
    path: 'form-builder/:',
    loadComponent: () => import('../shell/admin-page.component').then((m) => m.AdminPageComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
