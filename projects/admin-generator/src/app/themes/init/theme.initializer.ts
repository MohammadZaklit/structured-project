// app/core/theme/theme.initializer.ts
import { provideEnvironmentInitializer } from '@angular/core';
import { resolveTheme } from './theme.resolver';
import { AppTheme } from './theme.token';

let resolvedTheme: AppTheme;

export const getResolvedTheme = () => resolvedTheme;

export const provideThemeInitializer = () =>
  provideEnvironmentInitializer(() => {
    resolvedTheme = resolveTheme();
  });
