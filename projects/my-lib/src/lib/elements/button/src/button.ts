import { Component, Input } from '@angular/core';
import { Button } from './button.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class ButtonComponent {
  @Input() public config!: Button;
  public buttonstyle: string = '';

  ngOnInit(): void {
    this.buttonstyle = this.config.style ?? 'default';
  }
}
