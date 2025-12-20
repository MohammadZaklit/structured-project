import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppFloatingConfigurator } from 'projects/admin-generator/src/app/themes/default/layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-auth-base',
  imports: [CommonModule, AppFloatingConfigurator],
  templateUrl: './auth-base.html',
  styles: ``,
  standalone: true,
})
export class AuthBaseLayoutComponent {}
