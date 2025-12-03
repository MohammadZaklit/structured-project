import { Component, Input } from '@angular/core';
import { NzTextAreaComponent, NzTextarea } from '@zak-lib/ui-library/elements/form-fields/textarea';
@Component({
  selector: 'nz-standardtextarea',
  imports: [NzTextAreaComponent],
  templateUrl: './standardtextarea.html',
  styleUrl: './standardtextarea.css',
  standalone: true,
})
export class Standardtextarea {
  @Input() public config!: NzTextarea;
}
