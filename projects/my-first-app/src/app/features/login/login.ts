import { Component } from '@angular/core';
import { LoginCard } from '@zak-lib/ui-library/composed/login-card';
@Component({
  selector: 'app-login',
  imports: [LoginCard],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
