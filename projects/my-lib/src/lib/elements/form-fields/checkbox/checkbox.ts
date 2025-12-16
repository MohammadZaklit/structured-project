import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzFormField } from '../form-field/form-field';

@Component({
  selector: 'nz-Checkbox',
  standalone: true,
  imports: [FormsModule, CommonModule, CheckboxModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config"><p-checkbox [binary]="true" /></nz-form-field>`,
})
export class NzCheckBoxComponent {
  @Input() config!: NzCheckBox;
}
export interface NzCheckBox extends NzFormField {}
