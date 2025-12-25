import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzHttpService } from '../../shared/src/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class NzForgotPasswordService {
  private readonly API_URL = 'auth';
  private httpService = inject(NzHttpService);
  constructor() {}

  /**
   * Request reset password link
   */
  requestReset(email: string): Observable<any> {
    return this.httpService.post(`${this.API_URL}/request-reset-password`, { email });
  }

  /**
   * Validate reset token (called when user opens reset page)
   */
  validateToken(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.httpService.post(`${this.API_URL}/validate-reset-token`, { params });
  }

  /**
   * Reset password using token
   */
  resetPassword(token: string, password: string): Observable<any> {
    return this.httpService.post(`${this.API_URL}/reset-password`, {
      token,
      password,
    });
  }
}
