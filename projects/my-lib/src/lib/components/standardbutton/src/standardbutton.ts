import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';
import { NzStandardButton } from './standardbutton.interface';
import { NzLoaderService } from '@zak-lib/ui-library/shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'nz-standard-button',
  imports: [NzButtonComponent],
  templateUrl: './standardbutton.html',
  styleUrl: './standardbutton.scss',
  standalone: true,
})
export class NzStandardButtonComponent implements OnInit, OnDestroy {
  @Input() public config!: NzStandardButton;
  public buttonconfig!: NzButton;
  loaderService = inject(NzLoaderService);
  isDisabled = false;
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buttonconfig = this.config as NzButton;
    this.buttonconfig.disabled = () => {
      return this.isDisabled;
    };

    this.loaderService.loadingBtn$.pipe(takeUntil(this.destroy$)).subscribe((isLoadingBtn) => {
      this.isDisabled = isLoadingBtn;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
