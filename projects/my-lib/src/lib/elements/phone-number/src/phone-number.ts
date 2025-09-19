import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'lib-phone-number',
  imports: [FormsModule, InputMaskModule],
  templateUrl: './phone-number.html',
  styleUrl: './phone-number.css',
})
export class PhoneNumber {
  phone: string = '';
}
