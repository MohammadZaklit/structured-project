import { Component, OnInit } from '@angular/core';
import { Buttons } from '../../../components/standardbutton/src/standardbutton';
import { StandardButton } from '../../../components/standardbutton/src/standardbutton.interface';
import { Text } from '../../../elements/text';
import { email } from '../../../components/email/src/email.interface';
import { password } from '../../../components/password/src/password.interface';
import { heading } from '../../../components/heading/src/heading.interface';
import { Heading } from '../../../components/heading';
import { paragraph } from '../../../components/paragraph/src/paragraph.interface';
import { Paragraph } from '../../../components/paragraph';
import { Router } from '@angular/router';
@Component({
  selector: 'lib-login-card',
  imports: [Buttons, Text, Heading, Paragraph],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss',
})
export class LoginCard implements OnInit {
  public headingconfig!: heading;
  public emailconfig!: email;
  public passwordconfig!: password;
  public loginconfig!: StandardButton;
  public paragraphconfig!: paragraph;
  public gotoregisterconfig!: StandardButton;
  constructor(private router: Router) {}
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  ngOnInit(): void {
    this.headingconfig = {
      id: 'headingconfig',
      label: 'sign in',
      textstyle: 'h1',
    };
    this.paragraphconfig = {
      id: 'paragraphconfig',
      label: 'Welcome back! Please log in to your account.',
      textstyle: 'signin-description',
    };
    this.emailconfig = {
      id: 'emailinput',
      label: 'enter an email',
      textstyle: 'email',
    };
    this.passwordconfig = {
      id: 'passwordinput',
      label: 'enter a Password',
      textstyle: 'password',
    };
    this.loginconfig = {
      id: 'loginbutton',
      label: 'submit',
      style: 'default',
      onclick() {
        alert('s');
        return;
      },
    };
    this.gotoregisterconfig = {
      id: 'gotoregister',
      label: 'Create Account',
      style: 'back-button',
      onclick() {},
    };
  }
}
