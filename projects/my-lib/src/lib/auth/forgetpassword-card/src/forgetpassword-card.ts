import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzEmailComponent, NzEmail } from '@zak-lib/ui-library/components/email';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzParagraph, NzParagraphComponent } from '@zak-lib/ui-library/components/paragraph';
import { NzForgetPassword } from './forgetpassword.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzForgotPasswordService } from '../../services/forgot-password.service';
import { firstValueFrom } from 'rxjs';
import { NzAlertDialog, NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';
import { NzLink, NzLinkComponent } from '@zak-lib/ui-library/elements/link';
@Component({
  selector: 'nz-forgetpassword-card',
  imports: [
    NzStandardButtonComponent,
    NzEmailComponent,
    NzParagraphComponent,
    NzHeadingComponent,
    NzParagraphComponent,
    NzLinkComponent,
  ],
  templateUrl: './forgetpassword-card.html',
  styles: ``,
  standalone: true,
})
export class NzForgetPasswordComponent implements OnInit {
  @Input() config!: NzForgetPassword;
  public headingConfig!: NzHeading;
  public emailConfig!: NzEmail;
  public passwordConfig!: NzPassword;
  public confirmEmailConfig!: NzStandardButton;
  public paragraphConfig!: NzParagraph;
  public goToLoginConfig!: NzLink;
  public goToForgotPasswordConfig!: NzStandardButton;
  private forgetPasswordService = inject(NzForgotPasswordService);
  private alertService = inject(NzAlertDialogService);
  @Output() login = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  alertConfig?: NzAlertDialog;
  constructor() {}

  gotoLogin(): void {
    this.login.emit();
  }

  async forgetpassword(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response: { message: string } = await firstValueFrom(
        this.forgetPasswordService.requestReset(data.email),
      );

      // Success alert
      this.alertService.openDialog({
        type: 'success',
        title: 'Email Sent',
        message: response.message || 'Password reset link sent to your email',
      });

      // ❌ DO NOT emit user
      // ❌ DO NOT store token
    } catch (error: any) {
      this.alertService.openDialog({
        type: 'error',
        title: 'Request Failed',
        message: 'Email not found or something went wrong',
      });
    }
  }

  ngOnInit(): void {
    this.config.form.addControl('email', new NzFormControl(null));
    this.headingConfig = {
      id: 'headingconfig',
      label: 'Forgot Password',
      style: 'h1',
    };
    this.paragraphConfig = {
      id: 'paragraphconfig',
      style: 'p',
      label: 'Write your email address to recieve the reset link.',
    };
    this.emailConfig = {
      name: 'email',
      label: 'Email',
      settings: {
        placeholder: 'Enter your email address',
      },
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };
    this.confirmEmailConfig = {
      id: 'confirmemailbutton',
      label: 'Reset Password',
      onclick: () => {
        this.forgetpassword();
      },
    };
    this.goToLoginConfig = {
      label: 'Back to Login',
      click: (): Promise<void> => {
        return new Promise((resolve, _reject) => {
          this.gotoLogin();
          resolve();
        });
      },
    };
  }
}
