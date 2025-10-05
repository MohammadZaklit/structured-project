import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'modules', loadComponent: () => import('./components/modules/modules.component').then(m => m.ModulesComponent) },
  { path: 'fields', loadComponent: () => import('./components/fields/fields.component').then(m => m.FieldsComponent) }
];
