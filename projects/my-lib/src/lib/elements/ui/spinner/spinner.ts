import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzLoaderService } from '@zak-lib/ui-library/shared';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'nz-spinner',
  imports: [CommonModule, ProgressSpinnerModule],
  template: `@if (loaderService.loading$ | async) {
    <div class="global-loader"><p-progressSpinner strokeWidth="4"> </p-progressSpinner></div>
  }`,
  styles: `
    .global-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100vh;
    }
  `,
})
export class NzSpinnerComponent {
  loaderService = inject(NzLoaderService);
}
