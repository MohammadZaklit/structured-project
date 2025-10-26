// core/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  getCurrentTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'default';
  }

  setCurrentTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
