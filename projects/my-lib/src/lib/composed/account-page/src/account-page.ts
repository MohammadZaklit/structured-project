import { Component } from '@angular/core';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Router } from '@angular/router';
import { ButtonComponent } from '@zak-lib/ui-library/elements/button';
import { Paragraph } from '@zak-lib/ui-library/components/paragraph';
import { paragraph } from '@zak-lib/ui-library/components/paragraph/src/paragraph.interface';
import { DatePicker } from '@zak-lib/ui-library/elements/date-picker/date-picker';
import { Textarea } from '@zak-lib/ui-library/elements/textarea';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from './environment';

@Component({
  selector: 'lib-account-page',
  imports: [ButtonComponent, Paragraph, DatePicker, Textarea],
  templateUrl: './account-page.html',
  styleUrl: './account-page.css',
})
export class AccountPage {
  supabase: SupabaseClient;
  public gotosigninconfig!: StandardButton;
  public successedconfig!: paragraph;
  public datepickerconfig!: paragraph;
  public messageconfig!: paragraph;
  userEmail: string | null = null;
  isSignedin = false;
  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
  gotosignin() {
    this.router.navigate(['/login']);
  }
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.gotosigninconfig.label = 'sign in';
      this.successedconfig.label = 'Not signed in';
    }
  }

  ngOnInit() {
    this.userEmail = localStorage.getItem('username');
    this.isSignedin = !!this.userEmail;
    this.gotosigninconfig = {
      id: 'gotosigninconfig',
      label: this.isSignedin ? 'sign out' : 'sign in',
      style: 'sign-in',
      onclick: () => {
        if (this.gotosigninconfig.label === 'sign in') {
          this.gotosignin();
        } else if (this.isSignedin) {
          this.signOut();
        }
      },
    };
    this.successedconfig = {
      id: 'successconfig',
      label: this.isSignedin ? `Name : ${this.userEmail}` : `Not signed in`,
      textstyle: 'display-congrats',
    };
    this.datepickerconfig = {
      id: 'datepickerconfig',
      label: 'pick a date',
    };
    this.messageconfig = {
      id: 'messageconfig',
      label: 'type your message here : ',
    };
  }
}
