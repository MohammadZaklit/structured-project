import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NzGenericRecord } from '@zak-lib/ui-library/shared';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet (activate)="onChildActivate($event)" />`,
})
export class AuthLayoutComponent {
  private router = inject(Router);
  private onDestroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);

  constructor() {}

  public onChildActivate(component: any) {
    let selectedRecordId = undefined;
    if ('id' in component) {
      const childRoute = this.route.firstChild;
      selectedRecordId = childRoute?.snapshot.paramMap.get('id');
      component.id = selectedRecordId;
    }

    if (component.editRow) {
      component.editRow.pipe(takeUntil(this.onDestroy$)).subscribe((data: NzGenericRecord) => {
        component.id = selectedRecordId;
        this.router.navigate(['edit', data.id], { relativeTo: this.route });
      });
    }
    if (component.addRow) {
      component.addRow.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['form'], { relativeTo: this.route });
      });
    }
    if (component.successForm) {
      component.successForm.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['list'], { relativeTo: this.route });
      });
    }

    if (component.backCallback) {
      component.backCallback.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.router.navigate(['list'], { relativeTo: this.route });
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
