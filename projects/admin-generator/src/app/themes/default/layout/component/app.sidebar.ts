import { Component, ElementRef, input } from '@angular/core';
import { AppMenu } from './app.menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: ` <div class="layout-sidebar">
    <app-menu [menuItems]="menuItems()"></app-menu>
  </div>`,
})
export class AppSidebar {
  menuItems = input.required<MenuItem[]>();
  constructor(public el: ElementRef) {}
}
