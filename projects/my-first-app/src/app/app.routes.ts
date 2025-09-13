import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./shell/feature/layout/layout.routes').then((m) => m.layoutRoutes),
  },
];
