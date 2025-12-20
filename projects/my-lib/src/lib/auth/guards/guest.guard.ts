import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { NzAuthService } from '../../auth/services/auth.service';

export const NzGuestGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(NzAuthService);
  const router = inject(Router);

  const isAuth = await authService.isAuthenticated();
  if (isAuth) {
    await router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
