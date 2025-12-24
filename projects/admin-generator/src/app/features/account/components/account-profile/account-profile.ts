import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NzProfile,
  NzProfileComponent,
  NzUpdatePasswordPayload,
} from '@zak-lib/ui-library/account';
import { AccountBaseComponent } from '../account-base/account-base';
import { NzFormControl, NzFormGroup } from '@zak-lib/ui-library/shared';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'profile',
  standalone: true,
  imports: [NzProfileComponent, AccountBaseComponent],
  templateUrl: './account-profile.html',
  styleUrls: ['./account-profile.scss'],
})
export class AccountProfile implements OnInit {
  @Output() Login = new EventEmitter<void>();
  accountProfileConfig!: NzProfile;
  form = new NzFormGroup({});
  ngOnInit(): void {
    this.accountProfileConfig = {
      form: this.form,
    };
  }
  gotoLogin() {
    this.Login.emit();
  }
  applyUpdatePassword(): void {
    this.Login.emit;
  }
}
