import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzFormGroup } from '@zak-lib/ui-library/shared';
import { CommonModule } from '@angular/common';
import { AuthBaseLayoutComponent } from '../auth-base/auth-base';
import { NzRegisterCardComponent, NzRegisterCard } from '@zak-lib/ui-library/auth/register-card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, AuthBaseLayoutComponent, NzRegisterCardComponent],
  templateUrl: 'auth-register.html',
})
export class Authregister implements OnInit {
  registerCardConfig!: NzRegisterCard;
  form = new NzFormGroup({});

  @Output() login = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.registerCardConfig = {
      form: this.form,
    };
  }

  goToLogin(): void {
    this.login.emit();
  }

  applySuccessRegistration(): void {
    this.login.emit();
  }
}
