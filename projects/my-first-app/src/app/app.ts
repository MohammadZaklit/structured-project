import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Account } from './features/account/account';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('my-first-app');
  total = 0;
}
