import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { NzFormControl } from '@zak-lib/ui-library/shared/src/classes/NzFormControl';
import { NzFieldInfo } from '@zak-lib/ui-library/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface NzFormField extends NzFieldInfo, NzFormFieldSettings, NzFormFieldInputSettings {
  control?: NzFormControl;
}

export interface NzFormFieldSettings {
  value?: any;
  required?: boolean | ((formValue: any) => boolean);
  disabled?: boolean | ((formValue: any) => boolean);
  visible?: boolean | ((formValue: any) => boolean);
  apiValidate?: (value: any) => Promise<boolean>;
  extraProps?: any;
}

export interface NzFormFieldInputSettings {
  placeholder?: string;
  pattern?: string;
}

@Component({
  selector: 'nz-form-field',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `<div>
    <label>{{ baseConfig()?.label }}</label
    ><ng-content></ng-content>
  </div>`,
  styles: ``,
  standalone: true,
})
export class NzFormFieldComponent {
  baseConfig = signal<NzFormField | null>(null);

  constructor() {}

  newFormControl(): NzFormControl {
    return new NzFormControl();
  }
}
