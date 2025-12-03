import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { NzTextarea } from './textarea.interface';
@Component({
  selector: 'nz-textarea',
  imports: [TextareaModule, FormsModule],
  template: `<textarea rows="5" cols="30" pTextarea class="w-full"></textarea> `,
})
export class NzTextareaComponent {
  @Input() public config!: NzTextarea;
}
