import { Component, Input, OnInit } from '@angular/core';
import { inputInterface, InputElement } from '@zak-lib/ui-library/elements/input';
import { password } from './password.interface';

@Component({
  selector: 'lib-password',
  imports: [InputElement],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class Password implements OnInit {
  @Input() public config!: password;
  public passwordconfig!: inputInterface;
  ngOnInit() {
    this.passwordconfig = this.config as inputInterface;
  }
}
