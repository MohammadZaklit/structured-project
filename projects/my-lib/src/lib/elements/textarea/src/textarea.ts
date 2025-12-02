import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { NzTextarea } from './textarea.interface';
@Component({
  selector: 'nz-textarea',
  imports: [TextareaModule, FormsModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
})
export class NzTextareaComponent {
  @Input() public config!: NzTextarea;
}
