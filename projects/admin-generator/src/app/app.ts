import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { THEMES } from './shared/constants/themes';
import { NzSpinnerComponent } from '@zak-lib/ui-library/elements/ui/spinner';
import { ToastModule } from 'primeng/toast';
import { NzConfirmPopupComponent } from '@zak-lib/ui-library/elements/ui/confirm-popup';
import { NzConfirmDialogComponent } from '@zak-lib/ui-library/elements/ui/confirm-dialog';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzSpinnerComponent,
    ToastModule,
    NzConfirmDialogComponent,
    NzConfirmPopupComponent,
  ],
  template: `
    <nz-spinner></nz-spinner>
    <p-toast />
    <nz-confirm-popup />
    <nz-confirm-dialog />
    <router-outlet></router-outlet>
  `,
})
export class App {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  changeTheme(theme: string) {
    this.themeService.setCurrentTheme(theme);
    const themeLoader = THEMES[theme] ?? THEMES['default'];
    this.router.resetConfig([
      {
        path: '',
        loadChildren: themeLoader,
      },
    ]);
  }
}
