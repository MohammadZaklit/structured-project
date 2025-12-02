import { Component, Input } from '@angular/core';
import { NzTypography } from './typography.interface';

const styles = {
  h1: 'text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4',
  h2: '',
  h3: '',
  h4: '',
  h5: '',
  h6: '',
  p: '',
  small: '',
  span: '',
  div: '',
};
@Component({
  selector: 'nz-typography',
  imports: [],
  templateUrl: './typography.html',
  styleUrl: './typography.scss',
})
export class NzTypographyComponent {
  @Input() public config!: NzTypography;
  public textstyle: string = '';
  ngOnInit(): void {
    this.textstyle = this.config.looksLike
      ? styles[this.config.looksLike]
      : styles[this.config.style];
  }
}
