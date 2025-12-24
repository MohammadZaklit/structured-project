import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzEmailComponent, NzEmail } from '@zak-lib/ui-library/components/email';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzParagraph, NzParagraphComponent } from '@zak-lib/ui-library/components/paragraph';
import { NzLoginCard } from './login-card.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzAuthService, NzAuthUser } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { NzAlertDialog, NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';
@Component({
  selector: 'nz-login-card',
  imports: [
    NzStandardButtonComponent,
    NzEmailComponent,
    NzParagraphComponent,
    NzHeadingComponent,
    NzParagraphComponent,
    NzPasswordComponent,
  ],
  templateUrl: './login-card.html',
  styles: ``,
  standalone: true,
})
export class NzLoginCardComponent implements OnInit {
  @Input() config!: NzLoginCard;
  public headingConfig!: NzHeading;
  public emailConfig!: NzEmail;
  public passwordConfig!: NzPassword;
  public loginConfig!: NzStandardButton;
  public paragraphConfig!: NzParagraph;
  public gotoRegisterConfig!: NzStandardButton;
  public gotoForgotPasswordConfig!: NzStandardButton;
  private authService = inject(NzAuthService);
  private alertService = inject(NzAlertDialogService);
  @Output() register = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() successLogin = new EventEmitter<NzAuthUser>();
  alertConfig?: NzAlertDialog;
  constructor() {}

  goToRegister(): void {
    this.register.emit();
  }

  goToForgotPassword(): void {
    this.forgotPassword.emit();
  }
  async login(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response: {
        token: string;
        user: NzAuthUser;
      } = await firstValueFrom(this.authService.login(data));

      // Success

      this.alertService.openDialog({
        type: 'success',
        title: 'Login Successful',
        message: 'You have logged in successfully!',
      });
      this.successLogin.emit(response.user);
    } catch (error: any) {
      // Error

      this.alertService.openDialog({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid Credentials',
      });
    }
  }

  ngOnInit(): void {
    this.config.form.addControl('email', new NzFormControl(null));
    this.config.form.addControl('password', new NzFormControl(null));

    this.headingConfig = {
      id: 'headingconfig',
      label: 'sign in',
      style: 'h1',
    };
    this.paragraphConfig = {
      id: 'paragraphconfig',
      style: 'p',
      label: 'Welcome back! Please log in to your account.',
    };
    this.emailConfig = {
      name: 'email',
      label: 'Email',
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };
    this.passwordConfig = {
      name: 'password',
      label: 'Password',
      control: this.config.form.get('password') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.loginConfig = {
      id: 'loginbutton',
      label: 'submit',
      onclick: () => {
        this.login();
      },
    };
    this.gotoRegisterConfig = {
      id: 'gotoregister',
      label: 'Create Account',
      onclick: () => {
        this.goToRegister();
      },
    };
    this.gotoForgotPasswordConfig = {
      id: 'gotohome',
      label: 'Forgot Password?',
      onclick: () => {
        this.goToForgotPassword();
      },
    };
  }
}
