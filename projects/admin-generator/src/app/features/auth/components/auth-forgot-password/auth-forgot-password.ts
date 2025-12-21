import { Component, EventEmitter, Output } from '@angular/core';
import { AuthBaseLayoutComponent } from '../auth-base/auth-base';
import {
  NzForgetPasswordComponent,
  NzForgetPassword,
} from '@zak-lib/ui-library/auth/forgetpassword-card';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
import { NzAuthUser } from '@zak-lib/ui-library/auth';
@Component({
  selector: 'auth-forgot-password',
  imports: [AuthBaseLayoutComponent, NzForgetPasswordComponent],
  templateUrl: './auth-forgot-password.html',
  styles: ``,
})
export class AuthForgotPassword {
  forgetpasswordConfig!: NzForgetPassword;
  form = new NzFormGroup({});

  @Output() login = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.forgetpasswordConfig = {
      form: this.form,
    };
  }

  goTologin(): void {
    this.login.emit();
  }
}
