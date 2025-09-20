import { Component, Input, OnInit } from '@angular/core';
import { InputElement, inputInterface } from '@zak-lib/ui-library/elements/input';
import { nameInterface } from './name.interface';

@Component({
  selector: 'lib-name',
  imports: [InputElement],
  templateUrl: './name.html',
  styleUrl: './name.scss',
})
export class Name implements OnInit {
  @Input() public config!: nameInterface;
  public nameconfig!: inputInterface;
  ngOnInit(): void {
    this.nameconfig = this.config as inputInterface;
  }
}
