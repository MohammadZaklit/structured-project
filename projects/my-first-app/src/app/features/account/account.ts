import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  viewChild,
} from '@angular/core';
import { AccountPage } from '@zak-lib/ui-library/composed/account-page';
import { BirthdayCard } from '@zak-lib/ui-library/composed/birthday-card';
import { NzMultiSelectComponent } from '@zak-lib/ui-library/elements/form-fields/multiselect';
import { NzDatePickerComponent } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzCheckBoxComponent } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzTextAreaComponent } from '@zak-lib/ui-library/elements/form-fields/textarea';

@Component({
  selector: 'app-account',
  imports: [
    AccountPage,
    BirthdayCard,
    NzMultiSelectComponent,
    NzDatePickerComponent,
    NzCheckBoxComponent,
    NzTextAreaComponent,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  @ViewChild('emailInput') EmailInput!: ElementRef;
  @Input() count = 0;
  @Output() countchange = new EventEmitter<number>();
  increase() {
    this.count++;
    this.countchange.emit(this.count);
  }
  decrease() {
    this.count--;
    this.countchange.emit(this.count);
  }
  ngAfterContentInit() {
    console.log('content loaded');
  }
  ngAfterViewInit() {
    this.EmailInput.nativeElement.focus();
  }
}
