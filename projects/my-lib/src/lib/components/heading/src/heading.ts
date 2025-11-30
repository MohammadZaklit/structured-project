import { Component, Input } from '@angular/core';
import { NzTypographyComponent, NzTypography } from '@zak-lib/ui-library/elements/typography';

@Component({
  selector: 'nz-heading',
  imports: [NzTypographyComponent],
  templateUrl: './heading.html',
  styleUrl: './heading.scss',
  standalone: true,
})
export class NzHeadingComponent {
  @Input() public config!: NzTypography;
  public headingconfig!: NzTypography;
  ngOnInit() {
    this.headingconfig = this.config as NzTypography;
  }
}
