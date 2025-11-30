import { Component, OnInit } from '@angular/core';
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
  styleUrl: './login-card.scss',
  standalone: true,
})
export class LoginCard implements OnInit {
  private supabase: SupabaseClient;
  public headingconfig!: NzHeading;
  public emailconfig!: NzEmail;
  public passwordconfig!: NzPassword;
  public loginconfig!: NzStandardButton;
  public paragraphconfig!: NzParagraph;
  public gotoregisterconfig!: NzStandardButton;
  public gotohomeconfig!: NzStandardButton;
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
