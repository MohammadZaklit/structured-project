import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { NzFormField } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
export interface NzPhoneNumber extends NzFormField {}

@Component({
  selector: 'nz-phone-number',
  imports: [FormsModule, InputMaskModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="Config"
    ><p-inputMask mask="(999) 999-9999" placeholder="(123) 456-7890"></p-inputMask
  ></nz-form-field>`,
})
export class NzPhoneNumberComponent {
  @Input() Config!: NzPhoneNumber;
  phone: string = '';
}
