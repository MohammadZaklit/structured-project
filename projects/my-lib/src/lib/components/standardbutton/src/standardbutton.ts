import { Component, Input, OnInit } from '@angular/core';
import { Button, ButtonComponent } from '@zak-lib/ui-library/elements/button';
import { StandardButton } from './standardbutton.interface';

@Component({
  selector: 'lib-buttons',
  imports: [ButtonComponent],
  templateUrl: './standardbutton.html',
  styleUrl: './standardbutton.scss',
})
export class Buttons implements OnInit {
  @Input() public config!: StandardButton;
  public buttonconfig!: Button;
  ngOnInit(): void {
    this.buttonconfig = this.config as Button;
  }
}
