import { inject, Injectable } from '@angular/core';
import { NzConfirmPopup } from './confirm-popup.interface';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NzConfirmPopupService {
  private activeRef?: any | null;
  private confirmationService = inject(ConfirmationService);
  constructor() {}

  open<T>(event: Event, config: NzConfirmPopup): any | null {
    this.activeRef = this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: config.message,
      header: config.title,
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirm',
      },
      accept: () => {
        config.accept?.();
      },
      reject: () => {
        config.cancel?.();
      },
    });

    return this.activeRef;
  }
}
