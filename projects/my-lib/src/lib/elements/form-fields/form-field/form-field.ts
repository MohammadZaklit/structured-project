import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzFormControl } from '@zak-lib/ui-library/shared/src/classes/NzFormControl';
import { NzFormFieldInfo, NzFormFieldSettings, NzFormGroup } from '@zak-lib/ui-library/shared';

export interface NzFormField extends NzFormFieldInfo {
  control: NzFormControl;
  form: NzFormGroup;
  settings?: NzFormFieldSettings;
  hideLabel?: boolean;
}
@Component({
  selector: 'nz-form-field',
  imports: [CommonModule],
  template: `<div>
    @if (!baseConfig()?.hideLabel) {
      <label>{{ baseConfig()?.label }}</label>
    }
    <ng-content></ng-content>
  </div>`,
  styles: ``,
  standalone: true,
})
export class NzFormFieldComponent {
  baseConfig = input<NzFormField | null>(null);
  _t2: any;

  constructor() {}
}
