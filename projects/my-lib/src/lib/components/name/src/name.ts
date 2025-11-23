import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/input';
import { NzInputName } from './name.interface';

@Component({
  selector: 'nz-name',
  imports: [NzInputComponent],
  templateUrl: './name.html',
  styleUrl: './name.scss',
})
export class Name implements OnInit {
  @Input() public config!: NzInputName;
  public nameconfig!: NzInput;
  ngOnInit(): void {
    this.nameconfig = this.config as NzInput;
  }
}
