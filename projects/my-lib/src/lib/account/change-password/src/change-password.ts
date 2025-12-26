import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import {
  NzFormControl,
  NzFormGroup,
  NzPasswordComplexityValidator,
} from '@zak-lib/ui-library/shared';
import { firstValueFrom, take } from 'rxjs';
import { NzAccountService } from '@zak-lib/ui-library/account';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';
import { Validators } from '@angular/forms';
import { MatchPasswordValidator } from '@zak-lib/ui-library/shared/src/classes/NzControlMatchValidator';

export interface NzChangePassword {
  form: NzFormGroup;
  isReset?: boolean;
  resetToken?: string;
}

@Component({
  selector: 'nz-change-password',
  imports: [NzHeadingComponent, NzPasswordComponent, NzStandardButtonComponent],
  templateUrl: './change-password.html',
  styles: ``,
})
export class NzChangePasswordComponent {
  @Input() config!: NzChangePassword;
  private accountService = inject(NzAccountService);
  public headingConfig!: NzHeading;
  public oldPasswordConfig!: NzPassword;
  public newPasswordConfig!: NzPassword;
  public confirmPasswordConfig!: NzPassword;
  public saveConfig!: NzStandardButton;
  private alertService = inject(NzAlertDialogService);
  @Output() success = new EventEmitter<void>();
  @Output() invalid = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    if (this.config.isReset) {
      this.config.form.addControl('isReset', new NzFormControl(true));
      this.config.form.addControl(
        'resetToken',
        new NzFormControl(this.config.resetToken, [Validators.required]),
      );
      this.validateResetToken();
    } else {
      this.setChangePasswordControls();
    }

    this.config.form.addControl(
      'newPassword',
      new NzFormControl('', [
        Validators.required,
        NzPasswordComplexityValidator({
          minLength: 10,
          requireSpecialChar: true,
        }),
      ]),
    );
    this.config.form.addControl(
      'confirmPassword',
      new NzFormControl('', [
        Validators.required,
        MatchPasswordValidator({ matchControlName: 'newPassword' }),
      ]),
    ); //NzcontrolMatchValidator
    this.headingConfig = {
      id: 'headingconfig',
      label: 'Change Your Password',
      style: 'h1',
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
    this.saveConfig = {
      id: 'gotoregister',
      label: 'Change Password',
      onclick: () => {
        this.save();
      },
    };
  }

  async validateResetToken(): Promise<void> {
    try {
      await firstValueFrom(this.accountService.validateToken(this.config.resetToken as string));
    } catch (err: any) {
      this.alertService.openDialog({
        type: 'error',
        title: 'Error',
        message: err?.error?.message || 'The token you are using is invalid or expired',
      });
      this.disableFormFields();
      this.invalid.emit();
    }
  }

  disableFormFields(): void {
    this.config.form.disable();
  }

  save(): void {
    if (this.config.form.invalid) {
      this.alertService.openDialog({
        type: 'error',
        title: 'Error',
        message: 'Invalid of missing information',
      });

      this.config.form.markAllAsTouched();
    } else {
      // Call service to update password
      const payload = this.config.form.getRawValue();
      this.accountService
        .updatePassword(payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.alertService.openDialog({
              type: 'success',
              title: 'Success',
              message: 'Password updated successfully!',
            });
            this.success.emit();
            this.config.form.reset(); // Clear form fields
            if (this.config.isReset) {
              this.config.isReset = false;
              this.config.resetToken = '';
              this.setChangePasswordControls();
            }
          },
          error: (err: any) => {
            this.alertService.openDialog({
              type: 'error',
              title: 'Error',
              message: err?.error?.message || 'Failed to update password',
            });
          },
        });
    }
  }

  private setChangePasswordControls(): void {
    this.config.form.addControl('oldPassword', new NzFormControl('', [Validators.required]));
    this.oldPasswordConfig = {
      name: 'Old password',
      label: 'Old Password',
      control: this.config.form.get('oldPassword') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
  }
}
