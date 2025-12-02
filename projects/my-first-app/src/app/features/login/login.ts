import { Component } from '@angular/core';
import { NzMultiSelectComponent } from '@zak-lib/ui-library/elements/form-fields/multiselect';
import { NzDatePickerComponent } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzCheckBoxComponent } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzTextareaComponent } from '@zak-lib/ui-library/elements/form-fields/textarea';
@Component({
  selector: 'app-login',
  imports: [
    NzMultiSelectComponent,
    NzDatePickerComponent,
    NzCheckBoxComponent,
    NzTextareaComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
