import { Routes } from '@angular/router';
import { getResolvedTheme } from './themes/init/theme.initializer';
import { THEMES } from './shared/constants/themes';

export function createRoutes(): Routes {
  const theme = getResolvedTheme();
  const themeLoader = THEMES[theme] ?? THEMES['default'];
  return [
    {
      path: '',
      loadChildren: themeLoader,
    },
    { path: '**', redirectTo: 'auth' },
  ];
}
