import { Component, Input, OnInit } from '@angular/core';
import { inputInterface } from './input.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-input',
  imports: [FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputElement implements OnInit {
  @Input() public config!: inputInterface;

  public textstyle: string = '';

  ngOnInit(): void {
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
