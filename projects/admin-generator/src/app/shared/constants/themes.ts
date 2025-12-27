import { Routes } from '@angular/router';

export const THEMES: Record<string, () => Promise<Routes>> = {
  default: () => import('../../themes/default/default.routes').then((m) => m.routes),
  dark: () => import('../../themes/default/default.routes').then((m) => m.routes),
};
