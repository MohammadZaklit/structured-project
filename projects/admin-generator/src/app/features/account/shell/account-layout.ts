import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'Account-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet (activate)="onChildActivate($event)" />`,
})
export class AccountLayoutComponent {
  private router = inject(Router);
  private onDestroy$ = new Subject<void>();

  constructor() {}

  public onChildActivate(component: any) {
    if (component.dashboard) {
      component.dashboard.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }

    if (component.profile) {
      component.profile.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/account/profile']);
      });
    }
    if (component.login) {
      component.login.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
