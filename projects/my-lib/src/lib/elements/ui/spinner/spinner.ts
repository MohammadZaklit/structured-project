import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzLoaderService } from '@zak-lib/ui-library/shared';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'nz-spinner',
  imports: [CommonModule, ProgressBar],
  template: `@if (loaderService.loading$ | async) {
    <p-progressBar mode="indeterminate" [style]="{ height: '4px' }"></p-progressBar>
  }`,
  styles: `
    p-progressBar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
    }
  `,
})
export class NzSpinnerComponent {
  loaderService = inject(NzLoaderService);
}
