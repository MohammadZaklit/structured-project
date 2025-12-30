import { Component, Input } from '@angular/core';
import { NzTypography } from './typography.interface';
import { CommonModule } from '@angular/common';
const styles = {
  h1: 'text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4 ',
  h2: '',
  h3: 'text-xs font-semibold text-gray-500 uppercase mb-3',
  h4: '',
  h5: '',
  h6: '',
  p: 'text-muted-color font-medium',
  small: '',
  span: 'text-muted-color font-medium',
  div: '',
};
@Component({
  selector: 'nz-typography',
  imports: [CommonModule],
  template: `@switch (config.style) {
    @case ('h1') {
      <h1 class="{{ textstyle }}">{{ config.label }}</h1>
    }
    @case ('h2') {
      <h2 class="{{ textstyle }}">{{ config.label }}</h2>
    }
    @case ('h3') {
      <h3 class="{{ textstyle }}">{{ config.label }}</h3>
    }
    @case ('h4') {
      <h4 class="{{ textstyle }}">{{ config.label }}</h4>
    }
    @case ('h5') {
      <h5 class="{{ textstyle }}">{{ config.label }}</h5>
    }
    @case ('h6') {
      <h6 class="{{ textstyle }}">{{ config.label }}</h6>
    }
    @case ('p') {
      <p class="{{ textstyle }}">{{ config.label }}</p>
    }
    @case ('small') {
      <small class="{{ textstyle }}">{{ config.label }}</small>
    }
    @case ('span') {
      <span class="{{ textstyle }}">{{ config.label }}</span>
    }
    @default {
      <div class="{{ textstyle }}">{{ config.label }}</div>
    }
  } `,
})
export class NzTypographyComponent {
  @Input() public config!: NzTypography;
  public textstyle: string = '';

  ngOnInit(): void {
    this.textstyle = this.config?.looksLike
      ? styles[this.config.looksLike] || ''
      : styles[this.config?.style] || '';
  }
}
