import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'lib-upload-file',
  imports: [FileUpload, HttpClientModule, CommonModule],
  templateUrl: './upload-file.html',
  styleUrls: ['./upload-file.css'],
  providers: [MessageService],
})
export class UploadFile {
  @Output() onSelect = new EventEmitter<any>();

  handleFileSelect(event: any) {
    this.onSelect.emit(event); // re-emit to parent
  }
}
