import { Component, OnInit } from '@angular/core';
import { AccountPage } from '@zak-lib/ui-library/composed/account-page';

@Component({
  selector: 'app-account',
  imports: [AccountPage],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {}
