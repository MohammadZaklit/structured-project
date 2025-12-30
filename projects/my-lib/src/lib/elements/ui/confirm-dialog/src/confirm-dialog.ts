import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'nz-confirm-dialog',
  imports: [ConfirmDialog, ButtonModule],
  providers: [],
  template: `<p-confirmdialog />`,
  styles: ``,
  standalone: true,
})
export class NzConfirmDialogComponent {
  constructor() {}
}
