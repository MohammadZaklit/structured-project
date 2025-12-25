import { Component, OnInit } from '@angular/core';
import { NzAlertDialog } from './alert-dialog.interface';
import { CommonModule } from '@angular/common';
import { DialogService as PrimeDialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';
import { NzTypography, NzTypographyComponent } from '@zak-lib/ui-library/elements/typography';

@Component({
  selector: 'nz-alert-dialog',
  imports: [CommonModule, NzTypographyComponent, NzButtonComponent],
  providers: [PrimeDialogService],
  template: `<div class="mb-4"><nz-typography [config]="messageConfig"></nz-typography></div>
    <div class="flex justify-center">
      <nz-button [config]="okButtonConfig"></nz-button>
    </div>`,
  styleUrl: './alert-dialog.css',
})
export class NzAlertDialogComponent implements OnInit {
  dialogConfig!: NzAlertDialog;
  messageConfig!: NzTypography;
  okButtonConfig!: NzButton;
  get severity() {
    return this.dialogConfig.type === 'success'
      ? 'success'
      : this.dialogConfig.type === 'warning'
        ? 'warn'
        : 'error';
  }
  get icon() {
    switch (this.dialogConfig.type) {
      case 'success':
        return 'pi pi-check-circle'; // PrimeNG success icon
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'error':
      default:
        return 'pi pi-times-circle';
    }
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {
    this.dialogConfig = this.config.data;
  }

  ngOnInit(): void {
    this.okButtonConfig = {
      label: 'ok',
      type: 'button',
      onclick: () => {
        this.close(true);
      },
    };

    this.messageConfig = {
      id: 'dialog-' + this.dialogConfig.type,
      label: this.dialogConfig.message,
      style: 'p',
    };
  }

  close(result: boolean) {
    this.ref.close(result);
  }
}
