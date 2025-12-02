import { Component, Input } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { ToggleSwitch, ToggleSwitchModule } from 'primeng/toggleswitch';

export interface NzToggleSwitch extends NzFormField {
  properties?: ToggleSwitch;
}

@Component({
  selector: 'nz-toggle-switch',
  imports: [ToggleSwitchModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config"
    ><p-toggleswitch [formControl]="config.control"></p-toggleswitch>
    {{ config.label }}</nz-form-field
  >`,
  styles: ``,
})
export class NzToggleSwitchComponent extends NzFormFieldComponent {
  @Input() config!: NzToggleSwitch;

  constructor() {
    super();
  }
}
