import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
@Component({
  selector: 'nz-confirm-popup',
  imports: [ButtonModule, ConfirmPopupModule],
  providers: [],
  template: `<p-confirmpopup />`,
  styles: ``,
  standalone: true,
})
export class NzConfirmPopupComponent {
  constructor() {}
}
