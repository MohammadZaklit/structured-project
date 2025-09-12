import { Component } from '@angular/core';
import { email } from '../../../components/email/src/email.interface';
import { password } from '../../../components/password/src/password.interface';
import { StandardButton } from '../../../components/standardbutton/src/standardbutton.interface';
import { Buttons } from '../../../components/standardbutton/src/standardbutton';
import { Text } from '../../../elements/text';
import { heading } from '../../../components/heading/src/heading.interface';
import { Heading } from '../../../components/heading';
import { Router } from '@angular/router';
@Component({
  selector: 'lib-register-card',
  imports: [Buttons, Text, Heading],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard {
  public emailconfig!: email;
  public passwordconfig!: password;
  public registerconfig!: StandardButton;
  public headingconfig!: heading;
  public backtologinconfig!: StandardButton;
  email: string = '';
  password: string = '';
  constructor(private router: Router) {}
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
  }

  handleRegister(): void {
    if (
      this.validateEmail(this.emailconfig.value!) &&
      this.checkPasswordStrength(this.passwordconfig.value!)
    ) {
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
}
