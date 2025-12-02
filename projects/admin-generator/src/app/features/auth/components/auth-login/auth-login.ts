import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { NzLoginCardComponent, NzLoginCard } from '@zak-lib/ui-library/composed/login-card';
import { AppFloatingConfigurator } from '../../../../../app/themes/default/layout/component/app.floatingconfigurator';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [RouterModule, RippleModule, AppFloatingConfigurator, NzLoginCardComponent],
  templateUrl: 'auth-login.html',
})
export class AuthLogin implements OnInit {
  loginCardConfig!: NzLoginCard;
  form = new NzFormGroup({});
  constructor() {}

  ngOnInit(): void {
    this.loginCardConfig = {
      form: this.form,
    };
  }
}
