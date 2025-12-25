import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthBaseLayoutComponent } from '../auth-base/auth-base';
import {
  NzChangePassword,
  NzChangePasswordComponent,
} from '@zak-lib/ui-library/account/change-password';
import { NzFormGroup } from '@zak-lib/ui-library/shared';

@Component({
  selector: 'app-auth-reset-password',
  imports: [AuthBaseLayoutComponent, NzChangePasswordComponent],
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPassword implements OnInit {
  config!: NzChangePassword;
  @Input() resetToken!: string;
  form = new NzFormGroup({});
  @Output() login = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {
    this.config = {
      form: this.form,
      isReset: true,
      resetToken: this.resetToken,
    };
  }

  redirectToLogin(): void {
    this.login.emit();
  }
}
