import { Component, Input, OnInit } from '@angular/core';
import { inputInterface } from './input.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-input',
  imports: [FormsModule, InputTextModule],
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
