// app/core/theme/theme.resolver.ts
import { AppTheme } from './theme.token';

export function resolveTheme(): AppTheme {
  const stored = localStorage.getItem('theme') as AppTheme | null;
  return stored ?? 'default';
}
