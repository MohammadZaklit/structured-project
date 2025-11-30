import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'nz-phone-number',
  imports: [FormsModule, InputMaskModule],
  templateUrl: './phone-number.html',
  styleUrl: './phone-number.css',
})
export class NzPhoneNumberComponent {
  phone: string = '';
}
