import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { NzFormControl } from '@zak-lib/ui-library/shared/src/classes/NzFormControl';
import { NzFormFieldInfo, NzFormGroup } from '@zak-lib/ui-library/shared';

export interface NzFormField extends NzFormFieldInfo, NzFormFieldSettings {
  control: NzFormControl;
  form: NzFormGroup;
}

export interface NzFormFieldSettings {
  value?: any;
  isRequired?: boolean | ((formValue: any) => boolean);
  isDisabled?: boolean | ((formValue: any) => boolean);
  isVisible?: boolean | ((formValue: any) => boolean);
  apiValidate?: (value: any) => Promise<boolean>;
  extraProps?: any;
  placeholder?: string;
  pattern?: string;
}
@Component({
  selector: 'nz-form-field',
  imports: [CommonModule],
  template: `<div>
    <label>{{ baseConfig()?.label }}</label
    ><ng-content></ng-content>
  </div>`,
  styles: ``,
  standalone: true,
})
export class NzFormFieldComponent {
  baseConfig = input<NzFormField | null>(null);
  _t2: any;

  constructor() {}
}
