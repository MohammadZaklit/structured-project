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
  public headingconfig!: NzHeading;
  public emailconfig!: NzEmail;
  public passwordconfig!: NzPassword;
  public loginconfig!: NzStandardButton;
  public paragraphconfig!: NzParagraph;
  public goToRegisterConfig!: NzStandardButton;
  public goToForgotPasswordConfig!: NzStandardButton;

  private authService = inject(NzAuthService);
  @Output() register = new EventEmitter<void>();
  @Output() forgorPassword = new EventEmitter<void>();
  @Output() successLogin = new EventEmitter<NzAuthUser>();

  constructor() {}

  goToRegister(): void {
    this.register.emit();
  }

  goToForgotPassword(): void {
    this.forgorPassword.emit();
  }
  async login(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response = await firstValueFrom(this.authService.login(data));

      if (response) {
        this.successLogin.emit(response as NzAuthUser);
      }
    } catch (error: any) {
      console.error('Supabase login error:', error.message);
      alert(error.message);
      return;
    }
  }

  ngOnInit(): void {
    this.config.form.addControl('email', new NzFormControl(null));
    this.config.form.addControl('password', new NzFormControl(null));

    this.headingconfig = {
      id: 'headingconfig',
      label: 'sign in',
      style: 'h1',
    };
    this.paragraphconfig = {
      id: 'paragraphconfig',
      style: 'p',
      label: 'Welcome back! Please log in to your account.',
    };
    this.emailconfig = {
      name: 'email',
      label: 'Email',
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };
    this.passwordconfig = {
      name: 'password',
      label: 'Password',
      control: this.config.form.get('password') as NzFormControl, //It takes the password form control from your form and tells Angular: “Use this form control for this input field.”
      form: this.config.form,
    };
    this.loginconfig = {
      id: 'loginbutton',
      label: 'submit',
      style: 'default',
      onclick: () => {
        this.login();
      },
    };
    this.goToRegisterConfig = {
      id: 'gotoregister',
      label: 'Create Account',
      style: 'back-button',
      onclick: () => {
        this.goToRegister();
      },
    };
    this.goToForgotPasswordConfig = {
      id: 'gotohome',
      label: 'back to home ',
      style: 'back-button',
      onclick: () => {
        this.goToForgotPassword();
      },
    };
  }
}
