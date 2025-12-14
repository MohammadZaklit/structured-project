import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzFormFieldInfo, NzFormControl, NzFormGroup } from '@zak-lib/ui-library/shared';
import { NzFormField } from '../form-field/form-field';

@Component({
  selector: 'nz-date-picker',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePickerModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config"><p-date-picker></p-date-picker></nz-form-field> `,
})
export class NzDatePickerComponent {
  @Input() config!: NzDatePicker;
}

export interface NzDatePicker extends NzFormField {
  control: NzFormControl;
  form: NzFormGroup;
}
