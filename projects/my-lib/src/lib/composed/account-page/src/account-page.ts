import { Component } from '@angular/core';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Router } from '@angular/router';
import { Buttons } from '@zak-lib/ui-library/components/standardbutton';
import { Paragraph } from '@zak-lib/ui-library/components/paragraph';
import { paragraph } from '@zak-lib/ui-library/components/paragraph/src/paragraph.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './environment';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'nz-account-page',
  imports: [Buttons, Paragraph, CardModule],
  templateUrl: './account-page.html',
  styleUrl: './account-page.css',
})
export class AccountPage {
  supabase: SupabaseClient;
  public gotosigninconfig!: StandardButton;
  public successedconfig!: paragraph;
  public datepickerconfig!: paragraph;

  userName: string | undefined | null = null;
  isSignedin = false;
  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  gotosignin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    // Initialize configs so UI library has something to bind to immediately
    this.successedconfig = {
      id: 'successconfig',
      label: 'Loading...', // temporary text
      textstyle: 'display-congrats',
    };

    this.gotosigninconfig = {
      id: 'gotosigninconfig',
      label: 'sign in', // default
      style: 'sign-in',
      onclick: () => {
        if (!this.isSignedin) {
          this.gotosignin();
        } else {
          this.signOut();
        }
      },
    };

    this.datepickerconfig = {
      id: 'datepickerconfig',
      label: 'pick a date',
    };
    // Now load actual Supabase user
    this.loadUser();
  }

  async loadUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error || !data.user) {
      this.isSignedin = false;
      this.userName = null;

      this.successedconfig.label = `Not signed in`;
      this.gotosigninconfig.label = 'sign in';
      return;
    }

    this.isSignedin = true;
    this.userName = data.user.user_metadata['name'];

    this.successedconfig.label = `${this.userName}`;
    this.gotosigninconfig.label = 'sign out';
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (!error) {
      this.isSignedin = false;
      this.userName = null;

      this.gotosigninconfig.label = 'sign in';
      this.successedconfig.label = 'Not signed in';
    }
  }
}
