import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { NzConfirmDialog } from './confirm-dialog.interface';

@Component({
  selector: 'nz-confirm-dialog',
  imports: [ConfirmDialog, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  standalone: true,
})
export class NzConfirmDialogComponent implements OnInit {
  @Input() public config!: NzConfirmDialog;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.config.confirm = (event: Event) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: this.config.message,
        header: this.config.title,
        closable: true,
        closeOnEscape: true,
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
          this.config.accept?.();
        },
        reject: () => {
          this.config.cancel?.();
        },
      });
    };
  }
}
