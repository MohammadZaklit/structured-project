import { Component, OnInit } from '@angular/core';
import { AccountPage } from '@zak-lib/ui-library/composed/account-page';
import { BirthdayCard } from '@zak-lib/ui-library/composed/birthday-card';
@Component({
  selector: 'app-account',
  imports: [AccountPage, BirthdayCard],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {}
