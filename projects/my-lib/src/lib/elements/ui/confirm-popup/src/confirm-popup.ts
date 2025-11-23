import { Component, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NzConfirmPopup } from './confirm-popup.interface';
@Component({
  selector: 'nz-confirm-popup',
  imports: [ButtonModule, ConfirmPopupModule],
  providers: [ConfirmationService],
  templateUrl: './confirm-popup.html',
  styleUrl: './confirm-popup.css',
  standalone: true,
})
export class NzConfirmPopupComponent {
  @Input() public config!: NzConfirmPopup;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.config.confirm = (event: Event) => {
      this.confirmationService.confirm({
        target: event.currentTarget as EventTarget,
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
