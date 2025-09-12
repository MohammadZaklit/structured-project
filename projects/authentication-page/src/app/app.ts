import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterCard } from '../../../my-lib/src/lib/composed/register-card/src/register-card';
import { LoginCard } from '../../../my-lib/src/lib/composed/login-card/src/login-card';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('authentication-page');
}
