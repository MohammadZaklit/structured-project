import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { RadioButton } from 'primeng/radiobutton';

export interface NzRadioButton extends NzFormField, NzBaseSelect {}

@Component({
  selector: 'nz-radio-button',
  imports: [NzFormFieldModule, RadioButton],
  template: `<nz-form-field [baseConfig]="config"
    ><p-radio-button [formControl]="config.control" [value]="Options()"></p-radio-button
  ></nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzRadioButtonComponent extends NzFormFieldComponent {
  @Input() config!: NzRadioButton;

  Options = signal<NzOption[]>([]);

  constructor() {
    super();
  }
}
