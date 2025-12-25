import { Injectable, inject } from '@angular/core';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';

export interface NzChangePasswordPayload {
  token?: string;
  isReset?: boolean;
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class NzAccountService {
  private http = inject(NzHttpService);
  private readonly AUTH_URL = 'auth'; // your backend API
  private readonly ACCOUNT_URL = 'account'; // your backend API

  updatePassword(payload: NzChangePasswordPayload): Observable<any> {
    return this.http.post(`${this.ACCOUNT_URL}/change-password`, payload);
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.AUTH_URL}/validate-reset-token`, { resetToken: token });
  }

  updateProfile(payload: Record<string, any>): Observable<any> {
    return this.http.post(`${this.ACCOUNT_URL}/update-profile`, payload);
  }
}
