import { Component, Input } from '@angular/core';
import { NzTypographyComponent, NzTypography } from '@zak-lib/ui-library/elements/typography';
import { NzParagraph } from './paragraph.interface';

@Component({
  selector: 'nz-paragraph',
  imports: [NzTypographyComponent],
  templateUrl: './paragraph.html',
  styleUrl: './paragraph.css',
})
export class Paragraph {
  @Input() public config!: NzTypography;
  public paragraphconfig!: NzParagraph;
  ngOnInit() {
    this.paragraphconfig = this.config as NzTypography;
  }
}
