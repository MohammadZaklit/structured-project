import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'nz-Checkbox',
  standalone: true,
  imports: [FormsModule, CommonModule, CheckboxModule],
  template: `<p-checkbox [(ngModel)]="checked" [binary]="true" />`,
})
export class NzCheckBox {
  checked: any;
}
