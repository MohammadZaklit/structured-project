import { Component } from '@angular/core';
import { AppFloatingConfigurator } from 'projects/admin-generator/src/app/themes/default/layout/component/app.floatingconfigurator';

@Component({
  selector: 'app-account-base',
  imports: [AppFloatingConfigurator],
  templateUrl: './account-base.html',
  styleUrl: './account-base.scss',
})
export class AccountBaseComponent {}
