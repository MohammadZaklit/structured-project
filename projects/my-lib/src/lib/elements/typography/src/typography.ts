import { Component, Input } from '@angular/core';
import { NzTypography } from './typography.interface';

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
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
