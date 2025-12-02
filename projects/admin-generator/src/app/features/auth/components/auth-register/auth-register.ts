import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../app/themes/default/layout/component/app.floatingconfigurator';
import { environment } from '../env/env';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-register',
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
    ReactiveFormsModule,
  ],
  templateUrl: 'auth-register.html',
})
export class Authregister implements OnInit {
  private supabase: SupabaseClient;
  email: string = '';
  password: string = '';
  form!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  ngOnInit() {
    // Initialize form here with validation rules
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // password validation
    });
  }

  checked: boolean = false;
  async handleRegister() {
    if (this.form.invalid) {
      alert('Please enter a valid email and strong password ❌');
      return;
    }

    const result = await this.submit(); // now expecting a boolean result

    if (result) {
      alert('Account created successfully 🎉');
      this.goToLogin();
    } else {
      alert('There was an error during registration ❌');
    }
  }

  goToLogin() {
    this.router.navigate(['auth-login']);
  }
  async insertUser(email: string, password: string) {
    const { error } = await this.supabase.from('users').insert([{ email, password }]);
    if (error) throw error;
    return true;
  }
  async submit(): Promise<boolean> {
    // return type is boolean
    const email = this.form.value.email;
    const password = this.form.value.password;

    try {
      const { error } = await this.supabase.auth.signUp({ email, password });

      if (error) {
        alert('Auth error: ' + error.message);
        return false; // Return false if error occurs
      }

      // If signup is successful, insert extra profile data into your users table
      await this.insertUser(email, password);
      return true; // Return true if everything works
    } catch (err: any) {
      alert('Error: ' + err.message);
      return false; // Return false if a general error occurs
    }
  }
}
