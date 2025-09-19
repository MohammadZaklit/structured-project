import { Component } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'lib-textarea',
  imports: [TextareaModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
})
export class Textarea {}
