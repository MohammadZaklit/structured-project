import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet (activate)="onChildActivate($event)" />`,
})
export class AuthLayoutComponent {
  private router = inject(Router);
  private onDestroy$ = new Subject<void>();

  constructor() {}

  public onChildActivate(component: any) {
    if (component.dashboard) {
      component.dashboard.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }

    if (component.login) {
      component.login.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }

    if (component.register) {
      component.register.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/auth/register']);
      });
    }

    if (component.forgotPassword) {
      component.forgotPassword.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/auth/forgot-password']);
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
