import { Component } from '@angular/core';
import { NzAccountProfile } from '@zak-lib/ui-library/account';
@Component({
  selector: 'profile',
  standalone: true,
  imports: [NzAccountProfile],
  templateUrl: './account-profile.html',
  styleUrls: ['./account-profile.scss'],
})
export class AccountProfile {}
