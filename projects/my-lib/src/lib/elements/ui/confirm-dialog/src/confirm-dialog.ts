import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'nz-confirm-dialog',
  imports: [ConfirmDialogModule, ButtonModule],
  providers: [],
  template: `<p-confirmdialog />`,
  styles: ``,
  standalone: true,
})
export class NzConfirmDialogComponent {
  constructor() {}
}
