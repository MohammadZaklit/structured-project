import { Component } from '@angular/core';
import { NzMultiselectComponent } from '@zak-lib/ui-library/elements/form-fields/multiselect';
import { NzDatePicker } from '@zak-lib/ui-library/elements/form-fields/date-picker';
import { NzCheckBox } from '@zak-lib/ui-library/elements/form-fields/checkbox';
import { NzTextareaComponent } from '@zak-lib/ui-library/elements/form-fields/textarea';
@Component({
  selector: 'app-login',
  imports: [NzMultiselectComponent, NzDatePicker, NzCheckBox, NzTextareaComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
