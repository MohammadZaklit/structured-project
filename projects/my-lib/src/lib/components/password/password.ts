import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/form-fields/input';

export interface NzPassword extends NzInput {}
@Component({
  selector: 'nz-password',
  imports: [NzInputComponent],
  template: `<nz-input [config]="passwordconfig"></nz-input>`,
  styles: ``,
})
export class NzPasswordComponent implements OnInit {
  @Input() public config!: NzPassword;
  public passwordconfig!: NzInput;
  ngOnInit() {
    this.passwordconfig = Object.assign(this.config, {
      type: 'password',
    });
  }
}
