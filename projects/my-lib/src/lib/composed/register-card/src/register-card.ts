import { Component } from '@angular/core';
import { email } from '../../../components/email/src/email.interface';
import { password } from '../../../components/password/src/password.interface';
import { StandardButton } from '../../../components/standardbutton/src/standardbutton.interface';
import { Buttons } from '../../../components/standardbutton/src/standardbutton';
import { Text } from '../../../elements/text';
@Component({
  selector: 'lib-register-card',
  imports: [Buttons, Text],
  templateUrl: './register-card.html',
  styleUrl: './register-card.css',
})
export class RegisterCard {
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
      id: 'registerbutton',
      label: 'create account',
      style: 'default',
      onclick() {
        alert('s');
        return;
      },
    };
  }
}
