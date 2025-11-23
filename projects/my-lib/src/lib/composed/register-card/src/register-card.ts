import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { email } from '@zak-lib/ui-library/components/email/src/email.interface';
import { password } from '@zak-lib/ui-library/components/password/src/password.interface';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Buttons } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton';
import { heading } from '@zak-lib/ui-library/components/heading/src/heading.interface';
import { Heading } from '@zak-lib/ui-library/components/heading';
import { Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from './environment';
import { PhoneNumber } from '@zak-lib/ui-library/elements/phone-number';

import { nameInterface } from '@zak-lib/ui-library/components/name/src/name.interface';
import { Email } from '@zak-lib/ui-library/components/email';
import { Password } from '@zak-lib/ui-library/components/password/src/password';
import { InputElement } from '@zak-lib/ui-library/elements/input';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'nz-register-card',
  imports: [Buttons, Heading, PhoneNumber, Email, Password, InputElement],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard {
  message = '';
  private supabase: SupabaseClient;
  public nameconfig!: nameInterface;
  public emailconfig!: email;
  public passwordconfig!: password;
  public registerconfig!: StandardButton;
  public headingconfig!: heading;
  public backtologinconfig!: StandardButton;
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
    this.headingconfig = {
      id: 'headingconfig',
      label: 'register now',
      textstyle: 'title',
    };
    this.nameconfig = {
      id: 'nameinput',
      label: 'enter your name',
      textstyle: 'email',
      value: this.name,
    };
    this.emailconfig = {
      id: 'emailinput',
      label: 'enter an email',
      textstyle: 'email',
      value: this.email,
    };
    this.passwordconfig = {
      id: 'passwordInput',
      label: 'enter a Password',
      textstyle: 'password',
      value: this.password,
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
