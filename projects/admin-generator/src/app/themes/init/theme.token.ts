// app/core/theme/theme.token.ts
import { InjectionToken } from '@angular/core';

export type AppTheme = 'default' | 'dark';

export const APP_THEME = new InjectionToken<AppTheme>('APP_THEME');
