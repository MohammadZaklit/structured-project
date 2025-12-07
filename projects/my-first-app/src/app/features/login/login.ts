import { Component } from '@angular/core';
import { NzMultiSelectComponent } from '@zak-lib/ui-library/elements/form-fields/multiselect';
import { NzDatePickerComponent } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzCheckBoxComponent } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzTextAreaComponent } from '@zak-lib/ui-library/elements/form-fields/textarea';
import { AccountPage } from '@zak-lib/ui-library/composed/account-page';
import { BirthdayCard } from '@zak-lib/ui-library/composed/birthday-card';
@Component({
  selector: 'app-login',
  imports: [
    NzMultiSelectComponent,
    NzDatePickerComponent,
    NzCheckBoxComponent,
    NzTextAreaComponent,
    AccountPage,
    BirthdayCard,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
