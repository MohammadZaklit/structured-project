import { Injectable } from '@angular/core';

export type NzStorageType = 'local' | 'session' | 'cookie';

export interface NzStorageOptions {
  type?: NzStorageType;
  expiresDays?: number; // only for cookies
  path?: string; // only for cookies
  secure?: boolean; // only for cookies
  sameSite?: 'Lax' | 'Strict' | 'None';
}

@Injectable({
  providedIn: 'root',
})
export class NzStorageService {
  private defaultOptions: NzStorageOptions = {
    type: 'local',
    path: '/',
    sameSite: 'Lax',
  };

  // ---------- SET ----------
  set<T>(key: string, value: T, options?: NzStorageOptions): void {
    const opts = { ...this.defaultOptions, ...options };
    const serialized = JSON.stringify(value);

    switch (opts.type) {
      case 'local':
        localStorage.setItem(key, serialized);
        break;

      case 'session':
        sessionStorage.setItem(key, serialized);
        break;

      case 'cookie':
        this.setCookie(key, serialized, opts);
        break;
    }
  }

  // ---------- GET ----------
  get<T>(key: string, options?: NzStorageOptions): T | null {
    const opts = { ...this.defaultOptions, ...options };
    let value: string | null = null;

    switch (opts.type) {
      case 'local':
        value = localStorage.getItem(key);
        break;

      case 'session':
        value = sessionStorage.getItem(key);
        break;

      case 'cookie':
        value = this.getCookie(key);
        break;
    }

    return value ? (JSON.parse(value) as T) : null;
  }

  // ---------- REMOVE ----------
  remove(key: string, options?: NzStorageOptions): void {
    const opts = { ...this.defaultOptions, ...options };

    switch (opts.type) {
      case 'local':
        localStorage.removeItem(key);
        break;

      case 'session':
        sessionStorage.removeItem(key);
        break;

      case 'cookie':
        this.deleteCookie(key, opts.path);
        break;
    }
  }

  // ---------- CLEAR ----------
  clear(type: NzStorageType = 'local'): void {
    if (type === 'local') localStorage.clear();
    if (type === 'session') sessionStorage.clear();
  }

  // ---------- COOKIE HELPERS ----------
  private setCookie(key: string, value: string, options: NzStorageOptions) {
    let cookie = `${key}=${encodeURIComponent(value)}`;

    if (options.expiresDays) {
      const date = new Date();
      date.setTime(date.getTime() + options.expiresDays * 86400000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    cookie += `; path=${options.path}`;

    if (options.secure) cookie += '; Secure';
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

    document.cookie = cookie;
  }

  private getCookie(key: string): string | null {
    const name = `${key}=`;
    const cookies = document.cookie.split(';');

    for (const c of cookies) {
      const cookie = c.trim();
      if (cookie.startsWith(name)) {
        return decodeURIComponent(cookie.substring(name.length));
      }
    }
    return null;
  }

  private deleteCookie(key: string, path = '/') {
    document.cookie = `${key}=; Max-Age=0; path=${path}`;
  }
}
