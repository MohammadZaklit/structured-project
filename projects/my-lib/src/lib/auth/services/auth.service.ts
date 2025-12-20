import { Injectable, signal, computed, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NzStorageService, NzHttpService } from '@zak-lib/ui-library/shared';

export interface NzLoginPayload {
  email: string;
  password: string;
}

export interface NzAuthUser {
  id: string;
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NzAuthService {
  private readonly API_URL = 'auth/login';
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'auth_user';
  private httpService = inject(NzHttpService);
  private storage = inject(NzStorageService);
  private userSignal = signal<NzAuthUser | null>(this.getStoredUser());

  isAuthenticated = computed(() => !!this.userSignal());

  constructor() {}

  login(payload: NzLoginPayload): Observable<any> {
    return this.httpService.post<any>(this.API_URL, payload).pipe(
      tap((res) => {
        this.setSession(res.token, res.user);
      }),
    );
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.USER_KEY);

    this.userSignal.set(null);
  }

  getUser(): NzAuthUser | null {
    return this.userSignal();
  }

  getToken(): string | null {
    return this.storage.get(this.TOKEN_KEY);
  }

  private setSession(token: string, user: NzAuthUser): void {
    this.storage.set(this.TOKEN_KEY, token);
    this.storage.set(this.USER_KEY, user);

    this.userSignal.set(user);
  }

  private getStoredUser(): NzAuthUser | null {
    /*const user = this.storage.get(this.USER_KEY) as NzAuthUser | null;
    return user ? user : null;*/
    return null;
  }
}
