import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/input';
import { NzPassword } from './password.interface';

@Component({
  selector: 'nz-password',
  imports: [NzInputComponent],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class NzPasswordComponent implements OnInit {
  @Input() public config!: NzPassword;
  public passwordconfig!: NzInput;
  ngOnInit() {
    this.passwordconfig = this.config as NzInput;
  }
}
