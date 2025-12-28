import { Component, Input } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { PasswordModule } from 'primeng/password';
import { NzBaseInput } from '../interfaces/base-input.interface';
import { NzFormFieldModule } from '../form-field/form-field-module';
export interface NzPassword extends NzFormField, NzBaseInput {}
@Component({
  selector: 'nz-password',
  standalone: true,
  imports: [NzFormFieldModule, PasswordModule],
  template: `<nz-form-field [baseConfig]="config">
    <p-password
      [toggleMask]="true"
      [placeholder]="config.settings?.placeholder"
      [formControl]="config.control"
      fluid
      [invalid]="config.control.invalid && (config.control.dirty || config.control.touched)"
    />
  </nz-form-field>`,
})
export class NzPasswordComponent extends NzFormFieldComponent {
  @Input() config!: NzPassword;
  constructor() {
    super();
  }
}
