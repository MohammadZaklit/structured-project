import { Component, OnInit } from '@angular/core';
import { AccountBaseComponent } from '../account-base/account-base';
import {
  NzChangePassword,
  NzChangePasswordComponent,
} from '@zak-lib/ui-library/account/change-password';
import { NzFormGroup } from '@zak-lib/ui-library/shared';

@Component({
  selector: 'app-account-change-password',
  imports: [NzChangePasswordComponent, AccountBaseComponent],
  templateUrl: './account-change-password.html',
  styles: ``,
})
export class AccountChangePassword implements OnInit {
  config!: NzChangePassword;
  form = new NzFormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.config = {
      form: this.form,
    };
  }
}
