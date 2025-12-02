import { Component, Input, OnInit } from '@angular/core';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzEmailComponent, NzEmail } from '@zak-lib/ui-library/components/email';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/components/password';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzParagraph, NzParagraphComponent } from '@zak-lib/ui-library/components/paragraph';
import { Router } from '@angular/router';
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { createClient } from '@supabase/supabase-js';
import { environment } from './environment';
import { NzLoginCard } from './login-card.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
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
  private supabase: SupabaseClient;
  public headingconfig!: NzHeading;
  public emailconfig!: NzEmail;
  public passwordconfig!: NzPassword;
  public loginconfig!: NzStandardButton;
  public paragraphconfig!: NzParagraph;
  public gotoregisterconfig!: NzStandardButton;
  public gotohomeconfig!: NzStandardButton;
  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  goTohome(): void {
    this.router.navigate(['/account']);
  }
  async login(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response = await this.supabase.auth.signInWithPassword(data);
      alert('Signed in successfully');
      this.router.navigate(['/account']);
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
      isRequired: true,
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
    this.gotoregisterconfig = {
      id: 'gotoregister',
      label: 'Create Account',
      style: 'back-button',
      onclick: () => {
        this.goToRegister();
      },
    };
    this.gotohomeconfig = {
      id: 'gotohome',
      label: 'back to home ',
      style: 'back-button',
      onclick: () => {
        this.goTohome();
      },
    };
  }
}
