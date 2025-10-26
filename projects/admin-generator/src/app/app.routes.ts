// app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { themes } from './shared/constants/themes';

export const routes: Routes = [
  {
    path: '',
    loadChildren: async () => {
      // Get current theme dynamically
      const themeService = inject(ThemeService);
      const theme = themeService.getCurrentTheme(); // e.g. 'default' | 'dark'

      const themeRoutesModule = await (themes[theme] || themes['default']);
      console.warn('themeRoutesModule: ', themeRoutesModule);
      return themeRoutesModule.routes;
    },
  },
];
