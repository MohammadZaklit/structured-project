import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../shared/services/events.service';
import { map, Subject, Subscription, takeUntil } from 'rxjs';
import { GenericRecord } from '@zak-lib/ui-library/shared';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet (activate)="onChildActivate($event)" />`,
})
export class AdminPageComponent {
  private router = inject(Router);
  private onDestroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  selectedRecordId?: number | null;

  constructor() {
    this.route.firstChild?.paramMap
      .pipe(map((params) => params.get('id')))
      .subscribe((id) => (this.selectedRecordId = id ? parseInt(id) : null));
  }

  public onChildActivate(component: any) {
    if ('id' in component) {
      console.warn('is id: ' + this.selectedRecordId);
      component.id = this.selectedRecordId;
    }

    if (component.editRow) {
      component.editRow.pipe(takeUntil(this.onDestroy$)).subscribe((data: GenericRecord) => {
        component.id = this.selectedRecordId;
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
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
