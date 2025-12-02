import { Component, Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzBaseInput } from '../interfaces/base-input.interface';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { InputGroupModule } from 'primeng/inputgroup';

export interface NzInput extends NzFormField, NzBaseInput {}

@Component({
  selector: 'nz-input',
  imports: [NzFormFieldModule, InputTextModule, InputGroupModule],
  template: `<nz-form-field [baseConfig]="config"
    ><input type="{{ config.type || 'text' }}" pInputText [formControl]="config.control" fluid
  /></nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzInputComponent extends NzFormFieldComponent {
  @Input() public config!: NzInput;

  constructor() {
    super();
  }
}
