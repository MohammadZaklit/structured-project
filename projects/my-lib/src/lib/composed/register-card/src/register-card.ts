import { Component, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from './environment';
import { NzPhoneNumberComponent } from '@zak-lib/ui-library/elements/phone-number';
import { NzEmail, NzEmailComponent } from '@zak-lib/ui-library/components/email';
import { NzPasswordComponent, NzPassword } from '@zak-lib/ui-library/components/password';
import { NzNameComponent, NzName } from '@zak-lib/ui-library/components/name';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzLoginCard } from '../../login-card';
import { NzParagraph, NzParagraphComponent } from '@zak-lib/ui-library/components/paragraph';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'nz-register-card',
  imports: [
    NzStandardButtonComponent,
    NzHeadingComponent,
    NzPhoneNumberComponent,
    NzEmailComponent,
    NzPasswordComponent,
    NzNameComponent,
  ],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard {
  @Input() config!: NzLoginCard;
  message = '';
  private supabase: SupabaseClient;
  public nameconfig!: NzName;
  public emailconfig!: NzEmail;
  public passwordconfig!: NzPassword;
  public registerconfig!: NzStandardButton;
  public headingconfig!: NzParagraph;
  public backtologinconfig!: NzStandardButton;
  email: string = '';
  password: string = '';
  name: string = '';
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  ngOnInit(): void {
    this.config.form.addControl('name', new NzFormControl(null));
    this.config.form.addControl('email', new NzFormControl(null));
    this.config.form.addControl('password', new NzFormControl(null));

    this.headingconfig = {
      id: 'headingconfig',
      label: 'register now',
      style: 'h1',
    };
    this.nameconfig = {
      name: 'nameinput',
      label: 'enter your name',
      value: this.config.form.get('name')?.value,
      control: this.config.form.get('name') as NzFormControl,
      form: this.config.form,
    };
    this.emailconfig = {
      name: 'emailinput',
      label: 'enter an email',
      value: this.config.form.get('email')?.value,
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };
    this.passwordconfig = {
      name: 'passwordInput',
      label: 'enter a Password',
      value: this.config.form.get('password')?.value,
      control: this.config.form.get('password') as NzFormControl,
      form: this.config.form,
    };
    this.registerconfig = {
      id: 'registerbutton',
      label: 'create account',
      style: 'default',
      onclick: () => this.handleRegister(),
    };
    this.backtologinconfig = {
      id: 'backtologin',
      label: 'Back to Login',
      style: 'back-button',
      onclick() {},
    };
    this.form = this.fb.group({
      email: [this.emailconfig.value],
      password: [this.passwordconfig.value],
    });
  }
  async handleRegister() {
    if (
      this.validateName(this.nameconfig.value!) &&
      this.validateEmail(this.emailconfig.value!) &&
      this.checkPasswordStrength(this.passwordconfig.value!)
    ) {
      await this.submit();
      alert('Account created successfully 🎉');
      this.goToLogin();
    } else {
      alert('Email or password are not confirmed yet, or write a strong password ❌');
    }
  }
  // Use class methods for validation
  public validateName(name: string): boolean {
    // Only letters, spaces, hyphens, and apostrophes allowed, min 2 chars
    const re = /^[a-zA-ZÀ-ÿ' -]{2,}$/;
    return re.test(name.trim());
  }

  // Use class methods for validation
  public validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  public checkPasswordStrength(password: string): string | boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (strongRegex.test(password)) {
      return true;
    }
    return false;
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /* ===============================
       backend service 
     =============================== */
  async insertUser(email: string, password: string, name: string) {
    const { error } = await this.supabase.from('users').insert([{ email, password, name }]);
    if (error) throw error;
    return true;
  }
  async submit() {
    if (this.form.invalid) return;

    try {
      // Sign up with Supabase Auth (Authentication → Users)
      const { data, error } = await this.supabase.auth.signUp({
        email: this.emailconfig.value!,
        password: this.passwordconfig.value!,
        options: {
          data: {
            name: this.nameconfig.value!,
          },
        },
      });

      if (error) {
        this.message = 'Auth error: ' + error.message;
        return;
      }

      // If signup is successful, insert extra profile data into your users table
      // Only do this if Auth signup succeeded
      await this.insertUser(
        this.emailconfig.value!,
        this.passwordconfig.value!,
        this.nameconfig.value!,
      );

      this.message = 'Account created successfully!';
    } catch (err: any) {
      this.message = 'Error: ' + err.message;
    }
  }
}
