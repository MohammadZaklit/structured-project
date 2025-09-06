import { Component, Input, OnInit } from '@angular/core';
import { text } from './text.interface';
@Component({
  selector: 'lib-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.scss',
})
export class Text implements OnInit {
  @Input() public config!: text;
  public textstyle: string = '';
  ngOnInit(): void {
    this.textstyle = this.config.textstyle ?? 'default';
  }
}
