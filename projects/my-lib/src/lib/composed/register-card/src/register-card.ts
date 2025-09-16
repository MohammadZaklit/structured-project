import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { email } from '@zak-lib/ui-library/components/email/src/email.interface';
import { password } from '@zak-lib/ui-library/components/password/src/password.interface';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Buttons } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton';
import { InputElement } from '@zak-lib/ui-library/elements/input';
import { heading } from '@zak-lib/ui-library/components/heading/src/heading.interface';
import { Heading } from '@zak-lib/ui-library/components/heading';
import { Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from './environment';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'lib-register-card',
  imports: [Buttons, InputElement, Heading],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard {
  message = '';
  private supabase: SupabaseClient;
  public emailconfig!: email;
  public passwordconfig!: password;
  public registerconfig!: StandardButton;
  public headingconfig!: heading;
  public backtologinconfig!: StandardButton;
  email: string = '';
  password: string = '';
  form!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  ngOnInit(): void {
    this.headingconfig = {
      id: 'headingconfig',
      label: 'register now',
      textstyle: 'h1',
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
      this.validateEmail(this.emailconfig.value!) &&
      this.checkPasswordStrength(this.passwordconfig.value!)
    ) {
      localStorage.setItem('useremail', this.emailconfig.value!);
      await this.submit();
      alert('Account created successfully 🎉');
      this.goToLogin();
    } else {
      alert('Email or password are not confirmed yet, or write a strong password ❌');
    }
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
  async insertUser(email: string, password: string) {
    const { error } = await this.supabase.from('users').insert([{ email, password }]);
    if (error) throw error;
    return true;
  }
  async submit() {
    if (this.form.invalid) return;
    try {
      await this.insertUser(this.emailconfig.value!, this.passwordconfig.value!);
    } catch (err: any) {
      this.message = 'Error: ' + err.message;
    }
  }
}
