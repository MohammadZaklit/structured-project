import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../features/auth/components/env/env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public supabase: SupabaseClient;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private _user: User | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this._user = session.user;
        this._isLoggedIn$.next(true);
      }
    });

    // Listen to auth state changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this._user = session.user;
        this._isLoggedIn$.next(true);
      } else {
        this._user = null;
        this._isLoggedIn$.next(false);
      }
    });
  }

  /** Login with Supabase */
  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login failed:', error.message);
      this._isLoggedIn$.next(false);
      return false;
    }

    this._user = data.user;
    this._isLoggedIn$.next(true);
    return true;
  }

  /** Logout user */
  async logout() {
    await this.supabase.auth.signOut();
    this._user = null;
    this._isLoggedIn$.next(false);
  }

  /** Returns if the user is logged in */
  async isLoggedIn(): Promise<boolean> {
    return !!this._user;
  }

  /** Get the currently logged-in user */
  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Failed to get user:', error.message);
      return null;
    }
    this._user = data.user;
    return data.user;
  }

  /** Verify old password by re-authenticating */
  async verifyOldPassword(oldPassword: string): Promise<boolean> {
    const user = await this.getUser();
    if (!user || !user.email) return false;

    const { error } = await this.supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    return !error; // true if old password is correct
  }
}
