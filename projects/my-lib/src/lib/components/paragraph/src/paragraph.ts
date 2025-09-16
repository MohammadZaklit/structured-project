import { Component, Input } from '@angular/core';
import { typography, Typography } from '@zak-lib/ui-library/elements/typography';
import { paragraph } from './paragraph.interface';

@Component({
  selector: 'lib-paragraph',
  imports: [Typography],
  templateUrl: './paragraph.html',
  styleUrl: './paragraph.css',
})
export class Paragraph {
  @Input() public config!: typography;
  public paragraphconfig!: paragraph;
  ngOnInit() {
    this.paragraphconfig = this.config as typography;
  }
}
