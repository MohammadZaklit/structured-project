import { Component, Input, OnInit } from '@angular/core';
import { Slider } from 'primeng/slider';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';

export interface NzSliderProps {
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface NzSlider extends NzFormField {
  properties?: NzSliderProps;
}

@Component({
  selector: 'nz-slider',
  standalone: true,
  imports: [Slider, NzFormFieldModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-slider
        [formControl]="config.control"
        [min]="config.properties?.min"
        [max]="config.properties?.max"
        [step]="config.properties?.step"
        [range]="config.properties?.range"
        [orientation]="config.properties?.orientation ?? 'horizontal'"
      ></p-slider>
    </nz-form-field>
  `,
})
export class NzSliderComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzSlider;

  ngOnInit(): void {
    if (this.config) {
      this.config.hideLabel = true;
    }
  }
}
