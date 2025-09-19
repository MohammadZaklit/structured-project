import { Component } from '@angular/core';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton/src/standardbutton.interface';
import { Router } from '@angular/router';
import { ButtonComponent } from '@zak-lib/ui-library/elements/button';
import { Paragraph } from '@zak-lib/ui-library/components/paragraph';
import { paragraph } from '@zak-lib/ui-library/components/paragraph/src/paragraph.interface';
import { DatePicker } from '@zak-lib/ui-library/elements/date-picker/date-picker';
import { PhoneNumber } from '@zak-lib/ui-library/elements/phone-number';
import { Textarea } from '@zak-lib/ui-library/elements/textarea';

@Component({
  selector: 'lib-account-page',
  imports: [ButtonComponent, Paragraph, DatePicker, PhoneNumber, Textarea],
  templateUrl: './account-page.html',
  styleUrl: './account-page.css',
})
export class AccountPage {
  public gotosigninconfig!: StandardButton;
  public successedconfig!: paragraph;
  userEmail: string | null = null;
  isSignedin = false;
  constructor(private router: Router) {}
  gotosignin() {
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.userEmail = localStorage.getItem('useremail');
    this.isSignedin = !!this.userEmail;
    this.gotosigninconfig = {
      id: 'gotosigninconfig',
      label: this.isSignedin ? 'sign out' : 'sign in',
      style: 'sign-in',
      onclick: () => {
        if (this.gotosigninconfig.label === 'sign in') {
          this.gotosignin();
        } else if (this.isSignedin) {
          this.gotosigninconfig.label = 'sign in';
          this.successedconfig.label = 'Not signed in';
        }
      },
    };
    this.successedconfig = {
      id: 'successconfig',
      label: this.isSignedin ? `hello , signed In as: ${this.userEmail}` : `Not signed in`,
      textstyle: 'display-congrats',
    };
  }
}
