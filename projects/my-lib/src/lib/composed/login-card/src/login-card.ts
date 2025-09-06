import { Component, OnInit } from '@angular/core';
import { Buttons } from '../../../components/standardbutton/src/standardbutton';
import { StandardButton } from '../../../components/standardbutton/src/standardbutton.interface';
import { Text } from '../../../elements/text';
import { email } from '../../../components/email/src/email.interface';
import { password } from '../../../components/password/src/password.interface';

@Component({
  selector: 'lib-login-card',
  imports: [Buttons, Text],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss',
})
export class LoginCard implements OnInit {
  public emailconfig!: email;
  public passwordconfig!: password;
  public loginconfig!: StandardButton;
  ngOnInit(): void {
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
  }
}
