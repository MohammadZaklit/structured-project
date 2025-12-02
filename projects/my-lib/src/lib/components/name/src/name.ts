import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/input';
import { NzName } from './name.interface';

@Component({
  selector: 'nz-name',
  imports: [NzInputComponent],
  templateUrl: './name.html',
  styleUrl: './name.scss',
  standalone: true,
})
export class NzNameComponent implements OnInit {
  @Input() public config!: NzName;
  public nameconfig!: NzInput;
  ngOnInit(): void {
    this.nameconfig = this.config as NzInput;
  }
}
