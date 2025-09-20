import { Component, OnInit } from '@angular/core';
import { Buttons } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { InputElement } from '@zak-lib/ui-library/elements/input';
import { email } from '@zak-lib/ui-library/components/email/src/email.interface';
import { password } from '@zak-lib/ui-library/components/password/src/password.interface';
import { heading } from '@zak-lib/ui-library/components/heading/src/heading.interface';
import { Heading } from '@zak-lib/ui-library/components/heading';
import { paragraph } from '@zak-lib/ui-library/components/paragraph/src/paragraph.interface';
import { Paragraph } from '@zak-lib/ui-library/components/paragraph';
import { Router } from '@angular/router';
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { createClient } from '@supabase/supabase-js';
import { environment } from './environment';
@Component({
  selector: 'lib-login-card',
  imports: [Buttons, InputElement, Heading, Paragraph],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss',
})
export class LoginCard implements OnInit {
  private supabase: SupabaseClient;
  public headingconfig!: heading;
  public emailconfig!: email;
  public passwordconfig!: password;
  public loginconfig!: StandardButton;
  public paragraphconfig!: paragraph;
  public gotoregisterconfig!: StandardButton;
  public gotohomeconfig!: StandardButton;
  email: string = '';
  password: string = '';
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
    const storedEmail = this.emailconfig.value!;
    const storedPassword = this.passwordconfig.value!;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: storedEmail,
      password: storedPassword,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      alert(error.message);
      return;
    }
    if (data) {
      alert('Signed in successfully');
      this.router.navigate(['/account']);
    }
  }

  ngOnInit(): void {
    this.headingconfig = {
      id: 'headingconfig',
      label: 'sign in',
      textstyle: 'title',
    };
    this.paragraphconfig = {
      id: 'paragraphconfig',
      label: 'Welcome back! Please log in to your account.',
      textstyle: 'subtitle',
    };
    this.emailconfig = {
      id: 'emailinput',
      label: 'enter an email',
      textstyle: 'email',
      value: this.email,
    };
    this.passwordconfig = {
      id: 'passwordinput',
      label: 'enter a Password',
      textstyle: 'password',
      value: this.password,
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
  /* ==============================
         Backend service
     ==============================*/
  /* async checkUser(email: string, password: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password);
    if (error) {
      console.log('error fetching user: ', error.message);
      return false;
    }
    return data;
  }*/
}
