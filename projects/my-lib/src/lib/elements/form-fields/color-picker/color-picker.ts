import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzFormField } from '../form-field/form-field';

@Component({
  selector: 'nz-color-picker',
  standalone: true,
  imports: [FormsModule, CommonModule, ColorPickerModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config"><p-color-picker /></nz-form-field>`,
})
export class NzColorPickerComponent {
  @Input() config!: NzColorPicker;
}
export interface NzColorPicker extends NzFormField {}
