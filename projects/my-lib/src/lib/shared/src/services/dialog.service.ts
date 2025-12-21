import { inject, Injectable, Type } from '@angular/core';
import {
  DialogService as PrimeDialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class NzDialogService {
  private activeRef?: DynamicDialogRef | null;
  private primeDialog = inject(PrimeDialogService);
  constructor() {}

  open<T>(component: Type<T>, config?: DynamicDialogConfig): DynamicDialogRef | null {
    this.activeRef = this.primeDialog.open(component, {
      header: '',
      width: '50vw',
      closable: true,
      modal: true,
      dismissableMask: true,
      ...config,
    });

    return this.activeRef;
  }

  /**
   * Close a specific dialog reference
   */
  close(result?: any, ref?: DynamicDialogRef): void {
    const dialogRef = ref ?? this.activeRef;
    dialogRef?.close(result);
    this.activeRef = undefined;
  }
}
