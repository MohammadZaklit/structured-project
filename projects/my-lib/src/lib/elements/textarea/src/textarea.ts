import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { textareaInterface } from './textarea.interface';
@Component({
  selector: 'lib-textarea',
  imports: [TextareaModule, FormsModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
})
export class Textarea {
  @Input() public config!: textareaInterface;
}
