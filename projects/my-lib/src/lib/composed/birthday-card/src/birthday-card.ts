import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Buttons } from '@zak-lib/ui-library/components/standardbutton';
import { Paragraph } from '@zak-lib/ui-library/components/paragraph';
import { Standardtextarea } from '@zak-lib/ui-library/components/standardtextarea';
import { Standarduploadfile } from '@zak-lib/ui-library/components/standarduploadfile';
import { CardModule } from 'primeng/card';
import { paragraph } from '@zak-lib/ui-library/components/paragraph/src/paragraph.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'lib-birthday-card',
  imports: [
    Buttons,
    Paragraph,
    Standardtextarea,
    HttpClientModule,
    CardModule,
    CommonModule,
    FormsModule,
    FileUpload,
  ],
  templateUrl: './birthday-card.html',
  styleUrls: ['./birthday-card.css'],
})
export class BirthdayCard implements OnInit {
  // Configs
  public messageconfig!: paragraph;
  public createcard!: StandardButton;

  // State
  currentMessage: string = '';
  currentImage: string | ArrayBuffer | null = null;

  birthdayCards: { message: string; image?: string | ArrayBuffer | null }[] = [];

  @ViewChild('fileInput', { static: false }) fileInputComponent!: ElementRef;

  ngOnInit(): void {
    this.messageconfig = {
      id: 'messageconfig',
      label: 'Type your birthday message:',
    };

    this.createcard = {
      id: 'createcard',
      label: 'Create',
      style: 'create-card',
      onclick: () => {
        this.createCard();
      },
    };
  }

  // textarea input
  onTextAreaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.currentMessage = target.value;
  }

  // uploader input
  onFileSelected(event: any) {
    const file = event?.files?.[0]; // Step 1: Get the first file the user picked
    if (file) {
      const reader = new FileReader(); // Step 2: Create a tool to read files
      reader.onload = () => {
        this.currentImage = reader.result; // Step 4: Save the file’s data when it’s done loading
      };
      reader.readAsDataURL(file); // Step 3: Read the file as a "base64" image (like a text version of the image)
    }
  }

  // create card
  createCard() {
    if (!this.currentMessage && !this.currentImage) return;

    this.birthdayCards.push({
      message: this.currentMessage,
      image: this.currentImage,
    });

    // reset form
    this.currentMessage = '';
    this.currentImage = null;

    // clear file input if exists
    if (this.fileInputComponent) {
      (this.fileInputComponent.nativeElement as HTMLInputElement).value = '';
    }
  }
}
