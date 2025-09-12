import { Component, Input } from '@angular/core';
import { typography } from './typography.interface';

@Component({
  selector: 'lib-typography',
  imports: [],
  templateUrl: './typography.html',
  styleUrl: './typography.scss',
})
export class Typography {
  @Input() public config!: typography;
  public textstyle: string = '';
  ngOnInit(): void {
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
