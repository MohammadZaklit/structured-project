import { Component, Input } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzFormControl, NzFormGroup } from '@zak-lib/ui-library/shared';
@Component({
  selector: 'nz-textarea',
  imports: [TextareaModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config">
    <textarea rows="5" cols="30" pTextarea class="w-full"></textarea>
  </nz-form-field>`,
})
export class NzTextAreaComponent extends NzFormFieldComponent {
  @Input() public config!: NzTextarea;
}

export interface NzTextarea extends NzFormField {}
