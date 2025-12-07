import { Component, Input } from '@angular/core';
import { NzTypographyComponent } from '@zak-lib/ui-library/elements/typography';
import { NzHeading } from './heading.interface';

@Component({
  selector: 'nz-heading',
  imports: [NzTypographyComponent],
  template: `<nz-typography [config]="headingconfig"></nz-typography> `,
  standalone: true,
})
export class NzHeadingComponent {
  @Input() public config!: NzHeading;
  public headingconfig!: NzHeading;
  ngOnInit() {
    this.headingconfig = this.config;
  }
}
