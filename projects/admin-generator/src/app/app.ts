import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { THEMES } from './shared/constants/themes';
import { NzSpinnerComponent } from '@zak-lib/ui-library/elements/ui/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzSpinnerComponent],
  template: `<router-outlet></router-outlet><nz-spinner></nz-spinner>`,
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
          const themeRoutesModule = await THEMES[theme];
          return themeRoutesModule.routes;
        },
      },
    ]);
  }
}
