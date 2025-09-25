import { Component, EventEmitter, Output } from '@angular/core';
import { UploadFile } from '@zak-lib/ui-library/elements/upload-file';
@Component({
  selector: 'lib-standarduploadfile',
  imports: [UploadFile],
  templateUrl: './standarduploadfile.html',
  styleUrl: './standarduploadfile.css',
})
export class Standarduploadfile {
  currentImage!: string | ArrayBuffer | null;

  @Output() imageSelected = new EventEmitter<string | ArrayBuffer | null>();

  onImageSelected(image: string | ArrayBuffer | null) {
    this.currentImage = image;
    this.imageSelected.emit(this.currentImage); // forward to parent
  }
}
