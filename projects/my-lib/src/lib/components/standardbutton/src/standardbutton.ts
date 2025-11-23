import { Component, Input, OnInit } from '@angular/core';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';
import { NzStandardButton } from './standardbutton.interface';

@Component({
  selector: 'nz-buttons',
  imports: [NzButtonComponent],
  templateUrl: './standardbutton.html',
  styleUrl: './standardbutton.scss',
})
export class Buttons implements OnInit {
  @Input() public config!: NzStandardButton;
  public buttonconfig!: NzButton;
  ngOnInit(): void {
    this.buttonconfig = this.config as NzButton;
  }
}
