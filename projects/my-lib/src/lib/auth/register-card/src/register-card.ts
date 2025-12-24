import { Component, EventEmitter, inject, Injectable, Input, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzEmail, NzEmailComponent } from '@zak-lib/ui-library/components/email';
import { NzPasswordComponent, NzPassword } from '@zak-lib/ui-library/components/password';
import { NzNameComponent, NzName } from '@zak-lib/ui-library/components/name';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzRegisterCard } from './register-card.interface';
import { NzParagraph, NzParagraphComponent } from '@zak-lib/ui-library/components/paragraph';
import { firstValueFrom } from 'rxjs';
import { NzRegisterService } from '../../services/register.service';
import { NzPasswordComplexityValidator } from '@zak-lib/ui-library/shared';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'nz-register-card',
  imports: [
    NzStandardButtonComponent,
    NzHeadingComponent,
    NzEmailComponent,
    NzParagraphComponent,
    NzPasswordComponent,
    NzNameComponent,
  ],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class NzRegisterCardComponent {
  @Input() config!: NzRegisterCard;
  public nameconfig!: NzName;
  public emailconfig!: NzEmail;
  public paragraphconfig!: NzParagraph;
  public passwordconfig!: NzPassword;
  public registerconfig!: NzStandardButton;
  public headingconfig!: NzParagraph;
  public backtologinconfig!: NzStandardButton;
  private registerService = inject(NzRegisterService);

  @Output() login = new EventEmitter<void>();
  @Output() successRegistration = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.config.form.addControl('name', new NzFormControl(null, [Validators.required]));
    this.config.form.addControl(
      'email',
      new NzFormControl(null, [Validators.required, Validators.email]),
    );
    this.config.form.addControl(
      'password',
      new NzFormControl(null, [
        Validators.required,
        NzPasswordComplexityValidator({
          minLength: 10,
          requireSpecialChar: true,
        }),
      ]),
    );

    this.headingconfig = {
      id: 'headingconfig',
      label: 'Register Now',
      style: 'h1',
    };
    this.paragraphconfig = {
      id: 'paragraphconfig',
      style: 'p',
      label: 'Welcome back! Please create your account by filling the below information.',
    };
    this.nameconfig = {
      name: 'name',
      label: 'Enter your Name',
      control: this.config.form.get('name') as NzFormControl,
      form: this.config.form,
    };
    this.emailconfig = {
      name: 'email',
      label: 'Enter an Email',
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };
    this.passwordconfig = {
      name: 'password',
      label: 'Enter a Password',
      control: this.config.form.get('password') as NzFormControl,
      form: this.config.form,
    };
    this.registerconfig = {
      id: 'registerbutton',
      label: 'Create Account',
      style: 'default',
      onclick: () => this.register(),
    };
    this.backtologinconfig = {
      id: 'backtologin',
      label: 'Back to Login',
      style: 'back-button',
      onclick() {},
    };
  }
  async register(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response = await firstValueFrom(this.registerService.register(data));
      if (response) {
        // Emit success dialog config
        this.successRegistration.emit();
      }
    } catch (error: any) {}
  }
  gotoLogin() {
    this.login.emit();
  }
}
