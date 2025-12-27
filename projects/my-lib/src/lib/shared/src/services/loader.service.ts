import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NzLoaderService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingBtnSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  loadingBtn$ = this.loadingBtnSubject.asObservable();

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingBtnSubject.next(true);
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      this.loadingBtnSubject.next(false);
      this.loadingSubject.next(false);
    }
  }
}
