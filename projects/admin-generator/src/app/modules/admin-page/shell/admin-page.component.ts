import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet />`,
})
export class AdminPageComponent {
  constructor() {}
}
