import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.services';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const loggedIn = await this.auth.isLoggedIn();

    if (!loggedIn) return true;

    this.router.navigate(['/']);
    return false;
  }
}
