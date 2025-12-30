import { Component, Input, OnInit } from '@angular/core';
import { NzPassword, NzPasswordComponent } from '@zak-lib/ui-library/elements/form-fields/password';

export interface NzStandardPassword extends NzPassword {}
@Component({
  selector: 'nz-standard-password',
  imports: [NzPasswordComponent],
  template: `<nz-password [config]="passwordconfig"></nz-password>`,
  styles: ``,
})
export class NzStandardPasswordComponent implements OnInit {
  @Input() public config!: NzStandardPassword;
  public passwordconfig!: NzPassword;
  ngOnInit(): void {
    this.passwordconfig = this.config;
  }
}
