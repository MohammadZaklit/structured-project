import { Component, Input } from '@angular/core';
import { typography, Typography } from '@zak-lib/ui-library/elements/typography';

@Component({
  selector: 'lib-heading',
  imports: [Typography],
  templateUrl: './heading.html',
  styleUrl: './heading.scss',
})
export class Heading {
  @Input() public config!: typography;
  public headingconfig!: typography;
  ngOnInit() {
    this.headingconfig = this.config as typography;
  }
}
