import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthResetPassword } from '../components/auth-reset-password/auth-reset-password';

@Component({
  standalone: true,
  template: ` <app-auth-reset-password [resetToken]="resetToken" (login)="redirectToLogin()" /> `,
  imports: [AuthResetPassword],
})
export class ResetPasswordRouteComponent {
  private route = inject(ActivatedRoute);

  resetToken = this.route.snapshot.queryParamMap.get('token') as string;
  @Output() login = new EventEmitter<void>();

  redirectToLogin(): void {
    this.login.emit();
  }
}
