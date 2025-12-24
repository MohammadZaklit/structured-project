import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NzLink {
  label: string;
  isHref?: boolean;
  click?: () => Promise<void>;
  routerLink?: string;
  target?: '_blank' | '_self' | '_new'; // default _self, used only when isHref is true
}

@Component({
  selector: 'nz-link',
  imports: [RouterLink],
  template: `@if (config.click) {
      <a (click)="config.click()" class="{{ classes }}">{{ config.label }}</a>
    } @else if (config.isHref) {
      <a href="{{ config.routerLink }}" target="config.target || '_self'" class="{{ classes }}">{{
        config.label
      }}</a>
    } @else {
      <a [routerLink]="config.routerLink" class="{{ classes }}">{{ config.label }}</a>
    }`,
  styles: ``,
  standalone: true,
})
export class NzLinkComponent {
  @Input() config!: NzLink;
  classes = 'font-medium no-underline ml-2 text-right cursor-pointer text-primary';

  constructor() {}
}
