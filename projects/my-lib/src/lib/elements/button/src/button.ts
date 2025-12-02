import { Component, Input } from '@angular/core';
import { NzButton } from './button.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'nz-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class NzButtonComponent {
  @Input() public config!: NzButton;
  public buttonstyle: string = '';

  ngOnInit(): void {
    this.buttonstyle = this.config.style ?? 'default';
  }
}
