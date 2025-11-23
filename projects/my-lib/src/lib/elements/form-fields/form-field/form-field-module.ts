import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormFieldComponent } from './form-field';

@NgModule({
  declarations: [],
  imports: [NzFormFieldComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, NzFormFieldComponent],
})
export class NzFormFieldModule {}
