import { Component, Input, OnInit } from '@angular/core';
import { Text, text } from '../../../elements/text';
import { email } from './email.interface';

@Component({
  selector: 'lib-email',
  imports: [Text],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email implements OnInit {
  @Input() public config!: email;
  public emailconfig!: text;
  ngOnInit(): void {
    this.emailconfig = this.config as text;
  }
}
