import { Component, Input, OnInit } from '@angular/core';
import { Listbox } from 'primeng/listbox';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
export interface NzListBox extends NzFormField {
  properties?: Listbox;
}

@Component({
  selector: 'nz-listbox',
  standalone: true,
  imports: [Listbox, NzFormFieldModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-listbox
        [formControl]="config.control"
        [options]="config.properties?.options ?? []"
      ></p-listbox>
    </nz-form-field>
  `,
})
export class NzListboxComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzListBox;

  ngOnInit(): void {
    if (this.config) {
      this.config.hideLabel = true;
    }
  }
}
