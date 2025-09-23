import { Component, Input } from '@angular/core';
import { Textarea } from '@zak-lib/ui-library/elements/textarea';
import { Standardtextareainterface } from './standardtextarea.interface';
@Component({
  selector: 'lib-standardtextarea',
  imports: [Textarea],
  templateUrl: './standardtextarea.html',
  styleUrl: './standardtextarea.css',
})
export class Standardtextarea {
  @Input() public config!: Standardtextareainterface;
}
