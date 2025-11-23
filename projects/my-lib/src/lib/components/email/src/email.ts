import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/input';
import { email } from './email.interface';

@Component({
  selector: 'nz-email',
  imports: [NzInputComponent],
  templateUrl: './email.html',
  styleUrl: './email.scss',
})
export class Email implements OnInit {
  @Input() public config!: email;
  public emailconfig!: NzInput;
  ngOnInit(): void {
    this.emailconfig = this.config as NzInput;
  }
}
