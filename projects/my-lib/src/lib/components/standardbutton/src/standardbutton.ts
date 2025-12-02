import { Component, Input, OnInit } from '@angular/core';
import { NzButton, NzButtonComponent } from '@zak-lib/ui-library/elements/button';
import { NzStandardButton } from './standardbutton.interface';

@Component({
  selector: 'nz-standard-button',
  imports: [NzButtonComponent],
  templateUrl: './standardbutton.html',
  styleUrl: './standardbutton.scss',
  standalone: true,
})
export class NzStandardButtonComponent implements OnInit {
  @Input() public config!: NzStandardButton;
  public buttonconfig!: NzButton;
  ngOnInit(): void {
    this.buttonconfig = this.config as NzButton;
  }
}
