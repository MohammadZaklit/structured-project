import { Component, Input, OnInit } from '@angular/core';
import { NzInput } from './input.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
@Component({
  selector: 'nz-input',
  imports: [FormsModule, InputTextModule, InputGroupModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class NzInputComponent implements OnInit {
  @Input() public config!: NzInput;

  public textstyle: string = '';

  ngOnInit(): void {
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
