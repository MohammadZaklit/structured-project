import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { themes } from './shared/constants/themes';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class App {
  protected readonly title = signal('admin-generator');
  private themeService = inject(ThemeService);
  private router = inject(Router);
  constructor() {}

  changeTheme(theme: string) {
    this.themeService.setCurrentTheme(theme);

    this.router.resetConfig([
      {
        path: '',
        loadChildren: async () => {
          const themeRoutesModule = await themes[theme];
          return themeRoutesModule.routes;
        },
      },
    ]);
  }
}
