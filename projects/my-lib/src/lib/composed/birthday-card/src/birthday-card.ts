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
import { StandardCard } from '@zak-lib/ui-library/components/standard-card';

@Component({
  selector: 'nz-birthday-card',
  imports: [
    Buttons,
    Paragraph,
    Standardtextarea,
    HttpClientModule,
    CardModule,
    CommonModule,
    FormsModule,
    StandardCard,
    Standarduploadfile,
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

  currentImage!: string | ArrayBuffer | null;

  onImageSelected(image: string | ArrayBuffer | null) {
    this.currentImage = image; // now the image will show
    console.log('Selected image in composed:', image);
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
