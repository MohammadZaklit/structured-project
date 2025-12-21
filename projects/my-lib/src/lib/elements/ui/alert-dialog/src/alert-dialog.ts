import { Component, OnInit } from '@angular/core';
import { NzAlertDialog } from './alert-dialog.interface';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { DialogService as PrimeDialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';

@Component({
  selector: 'nz-alert-dialog',
  imports: [CommonModule, MessageModule, NzButtonComponent],
  providers: [PrimeDialogService],
  template: `<p-message
      [icon]="icon"
      [severity]="severity"
      [text]="dialogConfig.message"
    ></p-message
    ><nz-button [config]="okButtonConfig"></nz-button>`,
  styleUrl: './alert-dialog.css',
})
export class NzAlertDialogComponent implements OnInit {
  dialogConfig!: NzAlertDialog;
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
    console.warn('config: ', this.config);
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
    console.warn('config1: ', this.config);
    console.warn('dialogConfig: ', this.dialogConfig);
  }

  close(result: boolean) {
    this.ref.close(result);
  }
}
