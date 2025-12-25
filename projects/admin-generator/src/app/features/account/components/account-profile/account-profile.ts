import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzProfile, NzProfileComponent } from '@zak-lib/ui-library/account/profile';
import { AccountBaseComponent } from '../account-base/account-base';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
@Component({
  selector: 'profile',
  standalone: true,
  imports: [NzProfileComponent, AccountBaseComponent],
  templateUrl: './account-profile.html',
  styleUrls: ['./account-profile.scss'],
})
export class AccountProfile implements OnInit {
  @Output() login = new EventEmitter<void>();
  accountProfileConfig!: NzProfile;
  form = new NzFormGroup({});
  ngOnInit(): void {
    this.accountProfileConfig = {
      form: this.form,
    };
  }
  gotoLogin() {
    this.login.emit();
  }
  applyUpdatePassword(): void {
    this.login.emit;
  }
}
