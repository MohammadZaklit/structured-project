import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NzHttpService } from '../../shared/src/services/http.service';

export interface NzRegisterPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class NzRegisterService {
  private readonly API_URL = '/api/auth/register';
  private httpService = inject(NzHttpService);
  constructor() {}

  register(payload: NzRegisterPayload): Observable<any> {
    return this.httpService.post(this.API_URL, payload);
  }
}
