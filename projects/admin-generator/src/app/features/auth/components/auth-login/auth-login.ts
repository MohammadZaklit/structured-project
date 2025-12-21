import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzLoginCardComponent, NzLoginCard } from '@zak-lib/ui-library/auth/login-card';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
import { AuthBaseLayoutComponent } from '../auth-base/auth-base';
import { NzAuthUser } from '@zak-lib/ui-library/auth';
@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [AuthBaseLayoutComponent, NzLoginCardComponent],
  templateUrl: 'auth-login.html',
})
export class AuthLogin implements OnInit {
  loginCardConfig!: NzLoginCard;
  form = new NzFormGroup({});

  @Output() register = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() dashboard = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.loginCardConfig = {
      form: this.form,
    };
  }

  goToRegister(): void {
    this.register.emit();
  }

  goToForgotPassword(): void {
    this.forgotPassword.emit();
  }

  applySuccessLogin(_user: NzAuthUser): void {
    this.dashboard.emit();
  }
}
