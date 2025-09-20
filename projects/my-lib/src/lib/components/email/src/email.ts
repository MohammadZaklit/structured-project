import { Component, Input, OnInit } from '@angular/core';
import { InputElement, inputInterface } from '@zak-lib/ui-library/elements/input';
import { email } from './email.interface';

@Component({
  selector: 'lib-email',
  imports: [InputElement],
  templateUrl: './email.html',
  styleUrl: './email.scss',
})
export class Email implements OnInit {
  @Input() public config!: email;
  public emailconfig!: inputInterface;
  ngOnInit(): void {
    this.emailconfig = this.config as inputInterface;
  }
}
