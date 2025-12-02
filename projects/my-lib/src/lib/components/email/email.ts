import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/form-fields/input';

export interface NzEmail extends NzInput {}
@Component({
  selector: 'nz-email',
  imports: [NzInputComponent],
  template: `<nz-input [config]="emailconfig"></nz-input>`,
  styles: ``,
  standalone: true,
})
export class NzEmailComponent implements OnInit {
  @Input() public config!: NzEmail;
  public emailconfig!: NzInput;
  ngOnInit(): void {
    this.emailconfig = Object.assign(this.config, {
      type: 'email',
    });
  }
}
