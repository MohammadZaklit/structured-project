import { Component, Input, OnInit } from '@angular/core';
import { NzAlertDialog } from './alert-dialog.interface';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'lib-alert-dialog',
  imports: [Dialog, CommonModule, MessageModule],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
})
export class AlertDialogComponent implements OnInit {
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
}
