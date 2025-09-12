import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { text } from './text.interface';
@Component({
  selector: 'lib-text',
  imports: [FormsModule],
  templateUrl: './text.html',
  styleUrl: './text.scss',
})
export class Text implements OnInit, FormsModule {
  @Input() public config!: text;
  public textstyle: string = '';
  ngOnInit(): void {
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
