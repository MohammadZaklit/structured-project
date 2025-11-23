import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'nz-upload-file',
  imports: [FileUpload, HttpClientModule, CommonModule],
  templateUrl: './upload-file.html',
  styleUrls: ['./upload-file.css'],
  providers: [MessageService],
})
export class NzUploadFileComponent {
  @Output() onSelect = new EventEmitter<any>();
  currentImage!: string | ArrayBuffer | null;
  @Output() imageSelected = new EventEmitter<string | ArrayBuffer | null>();
  // uploader input
  onFileSelected(event: any) {
    const file = event?.files?.[0]; // Step 1: Get the first file the user picked
    if (file) {
      const reader = new FileReader(); // Step 2: Create a tool to read files
      reader.onload = () => {
        this.currentImage = reader.result; // Step 4: Save the file’s data when it’s done loading
        this.imageSelected.emit(this.currentImage);
      };
      reader.readAsDataURL(file); // Step 3: Read the file as a "base64" image (like a text version of the image)
    }
  }
}
