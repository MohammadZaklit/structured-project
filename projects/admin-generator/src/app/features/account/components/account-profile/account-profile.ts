import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzAccountProfile, NzAccountProfileComponent } from '@zak-lib/ui-library/account';
import { AccountBaseComponent } from '../account-base/account-base';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
@Component({
  selector: 'profile',
  standalone: true,
  imports: [NzAccountProfileComponent, AccountBaseComponent],
  templateUrl: './account-profile.html',
  styleUrls: ['./account-profile.scss'],
})
export class AccountProfile implements OnInit {
  @Output() Login = new EventEmitter();
  AccountProfileConfig!: NzAccountProfile;
  @Input() Accountprofileconfig!: NzAccountProfile;
  form = new NzFormGroup({});
  ngOnInit(): void {
    this.AccountProfileConfig = {
      form: this.form,
    };
  }
  gotologin() {
    this.Login.emit();
  }
}
