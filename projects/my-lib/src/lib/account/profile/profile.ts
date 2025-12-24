import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzProfile } from './profile.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';
import { NzProfileService } from '../services/profile-services';
import { NzPasswordComplexityValidator } from '@zak-lib/ui-library/shared';
import { take } from 'rxjs';
import { MatchPasswordValidator } from '@zak-lib/ui-library/shared/src/classes/NzControlMatchValidator';

@Component({
  selector: 'nz-profile',
  standalone: true,
  styles: ``,
  imports: [FormsModule, NzHeadingComponent, NzPasswordComponent, NzStandardButtonComponent],
  templateUrl: './profile.html',
})
export class NzProfileComponent implements OnInit {
  @Input() config!: NzProfile;
  private profileService = inject(NzProfileService);
  public headingConfig!: NzHeading;
  public oldPasswordConfig!: NzPassword;
  public newPasswordConfig!: NzPassword;
  public confirmPasswordConfig!: NzPassword;
  public changePasswordConfig!: NzStandardButton;
  private alertService = inject(NzAlertDialogService);
  @Output() successUpdatePassword = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.config.form.addControl('oldPassword', new NzFormControl(null, [Validators.required]));
    this.config.form.addControl(
      'newPassword',
      new NzFormControl(null, [
        Validators.required,
        NzPasswordComplexityValidator({
          minLength: 10,
          requireSpecialChar: true,
        }),
      ]),
    );
    this.config.form.addControl(
      'confirmPassword',
      new NzFormControl(null, [
        Validators.required,
        MatchPasswordValidator({ matchControlName: 'newPassword' }),
      ]),
    ); //NzcontrolMatchValidator
    this.headingConfig = {
      id: 'headingconfig',
      label: 'Change your Password',
      style: 'h1',
    };
    this.oldPasswordConfig = {
      name: 'Old password',
      label: 'Old Password',
      control: this.config.form.get('oldPassword') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.newPasswordConfig = {
      name: 'New password',
      label: 'New Password',
      control: this.config.form.get('newPassword') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.confirmPasswordConfig = {
      name: 'Confirm password',
      label: 'Confirm Password',
      control: this.config.form.get('confirmPassword') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
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

  UpdateUser(): void {
    // Call service to update password
    const payload = this.config.form.getRawValue();
    this.profileService
      .updatePassword(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.openDialog({
            type: 'success',
            title: 'Success',
            message: 'Password updated successfully!',
          });
          this.successUpdatePassword.emit(true);
          this.config.form.reset(); // Clear form fields
        },
        error: (err) => {
          this.alertService.openDialog({
            type: 'error',
            title: 'Error',
            message: err?.error?.message || 'Failed to update password',
          });
          this.successUpdatePassword.emit(false);
        },
      });
  }
}
