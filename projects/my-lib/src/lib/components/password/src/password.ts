import { Component, Input, OnInit } from '@angular/core';
import { text, Text } from '../../../elements/text';
import { password } from './password.interface';

@Component({
  selector: 'lib-password',
  imports: [Text],
  templateUrl: './password.html',
  styleUrl: './password.css',
})
export class Password implements OnInit {
  @Input() public config!: password;
  public passwordconfig!: text;
  ngOnInit() {
    this.passwordconfig = this.config as text;
  }
}
