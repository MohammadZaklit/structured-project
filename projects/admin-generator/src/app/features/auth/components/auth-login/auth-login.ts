import { Component, OnInit } from '@angular/core';
import { NzLoginCardComponent, NzLoginCard } from '@zak-lib/ui-library/auth/login-card';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
import { AuthBaseLayoutComponent } from '../auth-base/auth-base';
import {
  NzAlertDialog,
  NzAlertDialogComponent,
} from '@zak-lib/ui-library/elements/ui/alert-dialog';
@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [AuthBaseLayoutComponent, NzLoginCardComponent],
  templateUrl: 'auth-login.html',
})
export class AuthLogin implements OnInit {
  loginCardConfig!: NzLoginCard;
  form = new NzFormGroup({});
  constructor() {}

  ngOnInit(): void {
    this.loginCardConfig = {
      form: this.form,
    };
  }
}
