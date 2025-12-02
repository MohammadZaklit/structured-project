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
  private themeService = inject(ThemeService);
  private router = inject(Router);
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
