import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface NzIconProps {
  placeholder?: string;
  icon?: string; // PrimeIcons class e.g. 'pi pi-user'
  iconPosition?: 'left' | 'right';
  type?: 'text' | 'password' | 'email';
}

export interface NzIcon {
  properties?: NzIconProps;
}

@Component({
  selector: 'lib-icon-field',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, CommonModule, IconFieldModule, InputIconModule],
  template: `
    <p-iconfield [class.right]="config.properties?.iconPosition === 'right'">
      <p-inputicon [ngClass]="config.properties?.icon" class="pi" />
      <input
        [type]="config.properties?.type ?? 'text'"
        pInputText
        [placeholder]="config.properties?.placeholder"
      />
    </p-iconfield>
  `,
  styles: ``,
})
export class NzIconComponent {
  @Input() config!: NzIcon;
}
