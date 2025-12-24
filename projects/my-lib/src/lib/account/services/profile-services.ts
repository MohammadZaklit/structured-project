import { Injectable, inject } from '@angular/core';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';

export interface NzUpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class NzProfileService {
  private http = inject(NzHttpService);
  private readonly API_URL = 'auth/update-password'; // your backend API

  updatePassword(payload: NzUpdatePasswordPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
