import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppFloatingConfigurator } from 'projects/admin-generator/src/app/themes/default/layout/component/app.floatingconfigurator';
import { NzAuthService } from '@zak-lib/ui-library/auth';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzAccountProfile } from './profile.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzAlertDialog, NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';

@Component({
  selector: 'nz-profile',
  standalone: true,
  imports: [
    FormsModule,
    AppFloatingConfigurator,
    NzHeadingComponent,
    NzPasswordComponent,
    NzStandardButtonComponent,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class NzAccountProfileComponent implements OnInit {
  @Input() config!: NzAccountProfile;
  private authService = inject(NzAuthService);
  public headingconfig!: NzHeading;
  public oldPasswordconfig!: NzPassword;
  public newPasswordconfig!: NzPassword;
  public confirmPasswordconfig!: NzPassword;
  public changePasswordConfig!: NzStandardButton;
  private alertService = inject(NzAlertDialogService);
  @Output() Login = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.headingconfig = {
      id: 'headingconfig',
      label: 'Change Your Password',
      style: 'h1',
    };
    this.oldPasswordconfig = {
      name: 'Old password',
      label: 'Old Password',
      control: this.config.form.get('password') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.newPasswordconfig = {
      name: 'New password',
      label: 'New Password',
      control: this.config.form.get('password') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.confirmPasswordconfig = {
      name: 'Confirm password',
      label: 'Confirm Password',
      control: this.config.form.get('password') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.changePasswordConfig = {
      id: 'gotoregister',
      label: 'Create Account',
      onclick: () => {
        this.UpdateUser();
      },
    };
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  async UpdateUser() {
    // 1️⃣ Check login
    if (!this.isLoggedIn) {
      this.Login.emit();
    }
    // 2️⃣ Validate password fields
    if (!this.oldPasswordconfig || !this.newPasswordconfig || !this.confirmPasswordconfig) {
      this.alertService.openDialog({
        type: 'error',
        title: 'error in changing password',
        message: 'You must fill the required fields',
      });
    }
    if (this.newPasswordconfig !== this.confirmPasswordconfig) {
      this.alertService.openDialog({
        type: 'error',
        title: 'error in changing password',
        message: 'New password and confirm password do not match.',
      });
    }
    if (this.newPasswordconfig === this.oldPasswordconfig) {
      this.alertService.openDialog({
        type: 'error',
        title: 'error in changing password',
        message: 'New password cannot be the same as the old password.',
      });
    }

    this.alertService.openDialog({
      type: 'success',
      title: 'password has changed',
      message: 'Password updated successfully!',
    });
    // 5️⃣ Clear form fields
    this.config.form.reset();
  }
}
