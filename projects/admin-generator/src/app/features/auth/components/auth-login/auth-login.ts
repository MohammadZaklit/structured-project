import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { email } from '@zak-lib/ui-library/components/email/src/email.interface';
import { password } from '@zak-lib/ui-library/components/password/src/password.interface';
import { AppFloatingConfigurator } from '../../../../../app/themes/default/layout/component/app.floatingconfigurator';
import { environment } from '../env/env';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from 'projects/admin-generator/src/app/core/services/auth.services';
@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
  ],
  templateUrl: 'auth-login.html',
})
export class AuthLogin {
  private supabase: SupabaseClient;
  email: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  checked: boolean = false;
  async login(): Promise<void> {
    try {
      await this.auth.login(this.email, this.password);
      alert('Signed in successfully');
      this.router.navigate(['']);
    } catch (err: any) {
      alert(err.message);
    }
  }
  gocreateaccount() {
    this.router.navigate(['/auth-register']);
  }
}
