import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzFormControl } from '@zak-lib/ui-library/shared/src/classes/NzFormControl';
import { NzFormFieldInfo, NzFormFieldSettings, NzFormGroup } from '@zak-lib/ui-library/shared';
import { MessageModule } from 'primeng/message';

export interface NzFormField extends NzFormFieldInfo {
  control: NzFormControl;
  form: NzFormGroup;
  settings?: NzFormFieldSettings;
  hideLabel?: boolean;
}
@Component({
  selector: 'nz-form-field',
  imports: [CommonModule, MessageModule],
  template: `<div class="text-left">
    @if (!baseConfig()?.hideLabel) {
      <label class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-1">{{
        baseConfig()?.label
      }}</label>
    }
    <ng-content></ng-content>

    @if (baseConfig()?.control?.invalid && baseConfig()?.control?.touched) {
      @for (error of baseConfig()?.control?.errors | keyvalue; track error.key) {
        <p-message severity="error" variant="simple" size="small"
          >{{ error.key }}: {{ error.value }}</p-message
        >
      }
    }
  </div>`,
  styles: ``,
  standalone: true,
})
export class NzFormFieldComponent {
  baseConfig = input<NzFormField | null>(null);
  _t2: any;

  constructor() {}
}
