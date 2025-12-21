import { inject, Injectable } from '@angular/core';
import { NzAlertDialog } from '../src/alert-dialog.interface';
import { NzAlertDialogComponent } from '../src/alert-dialog';
import { Subject, take } from 'rxjs';
import { NzDialogService } from '@zak-lib/ui-library/shared';

@Injectable({
  providedIn: 'root',
})
export class NzAlertDialogService {
  public onClose$ = new Subject<Record<string, any> | null>();
  private dialogService = inject(NzDialogService);
  constructor() {}

  public openDialog(config: NzAlertDialog): void {
    const ref = this.dialogService.open(NzAlertDialogComponent, {
      header: config.title,
      width: '30rem',
      data: config,
    });

    ref?.onClose.pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onClose$.next(config.customData || null);
      }
    });
  }
}
