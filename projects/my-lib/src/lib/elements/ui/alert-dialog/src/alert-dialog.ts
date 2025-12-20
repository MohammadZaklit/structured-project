import { Component, Input, OnInit } from '@angular/core';
import { NzAlertDialog } from './alert-dialog.interface';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'nz-alert-dialog',
  imports: [Dialog, CommonModule, MessageModule],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
})
export class NzAlertDialogComponent implements OnInit {
  @Input() config!: NzAlertDialog;
  public dialogtype: string = '';
  ngOnInit(): void {
    this.dialogtype = this.config.type ?? 'error';
  }
  get severity() {
    return this.config.type === 'success'
      ? 'success'
      : this.config.type === 'warning'
        ? 'warn'
        : this.config.type === 'cancel'
          ? 'info'
          : 'error';
  }
  get icon() {
    switch (this.config.type) {
      case 'success':
        return 'pi pi-check-circle'; // PrimeNG success icon
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'cancel':
        return 'pi pi-info-circle';
      case 'error':
      default:
        return 'pi pi-times-circle';
    }
  }
}
