import { Component, Input, OnInit } from '@angular/core';
import { NzInput, NzInputComponent } from '@zak-lib/ui-library/elements/input';
import { NzEmail } from './email.interface';

@Component({
  selector: 'nz-email',
  imports: [NzInputComponent],
  templateUrl: './email.html',
  styleUrl: './email.scss',
  standalone: true,
})
export class NzEmailComponent implements OnInit {
  @Input() public config!: NzEmail;
  public emailconfig!: NzInput;
  ngOnInit(): void {
    this.emailconfig = this.config as NzInput;
  }
}
