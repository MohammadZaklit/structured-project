import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  selector: 'nz-date-picker',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePickerModule],
  template: `<p-date-picker></p-date-picker> `,
})
export class NzDatePicker {}
