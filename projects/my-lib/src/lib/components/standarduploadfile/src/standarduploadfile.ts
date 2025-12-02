import { Component, EventEmitter, Output } from '@angular/core';
import { NzUploadFileComponent } from '@zak-lib/ui-library/elements/upload-file';
@Component({
  selector: 'nz-standarduploadfile',
  imports: [NzUploadFileComponent],
  templateUrl: './standarduploadfile.html',
  styleUrl: './standarduploadfile.css',
  standalone: true,
})
export class Standarduploadfile {
  currentImage!: string | ArrayBuffer | null;

  @Output() imageSelected = new EventEmitter<string | ArrayBuffer | null>();

  onImageSelected(image: string | ArrayBuffer | null) {
    this.currentImage = image;
    this.imageSelected.emit(this.currentImage); // forward to parent
  }
}
