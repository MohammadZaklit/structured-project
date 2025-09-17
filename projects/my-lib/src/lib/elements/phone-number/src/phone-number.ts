import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-phone-number',
  imports: [FormsModule],
  templateUrl: './phone-number.html',
  styleUrl: './phone-number.css',
})
export class PhoneNumber {
  phone: string = '';
}
