import { Component, Input } from '@angular/core';
import { NzTextareaComponent } from '@zak-lib/ui-library/elements/textarea';
import { Standardtextareainterface } from './standardtextarea.interface';
@Component({
  selector: 'nz-standardtextarea',
  imports: [NzTextareaComponent],
  templateUrl: './standardtextarea.html',
  styleUrl: './standardtextarea.css',
  standalone: true,
})
export class Standardtextarea {
  @Input() public config!: Standardtextareainterface;
}
