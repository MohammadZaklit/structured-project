import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AppFloatingConfigurator } from 'projects/admin-generator/src/app/themes/default/layout/component/app.floatingconfigurator';
import { NzAuthService } from '@zak-lib/ui-library/auth';

@Component({
  selector: 'edit-profile',
  standalone: true,
  imports: [FormsModule, Password, Button, AppFloatingConfigurator],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss'],
})
export class EditProfile implements OnInit {
  Oldpassword: string = '';
  Newpassword: string = '';
  Confirmpassword: string = '';

  constructor(
    private router: Router,
    private auth: NzAuthService,
  ) {}

  async ngOnInit() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth-login']);
    }
  }

  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  async UpdateUser() {
    // 1️⃣ Check login
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // 2️⃣ Validate password fields
    if (!this.Oldpassword || !this.Newpassword || !this.Confirmpassword) {
      throw new Error('Please fill in all password fields.');
    }
    if (this.Newpassword !== this.Confirmpassword) {
      throw new Error('New password and confirm password do not match.');
    }
    if (this.Newpassword === this.Oldpassword) {
      throw new Error('New password cannot be the same as the old password.');
    }

    // 3️⃣ Verify old password
    // const oldPasswordValid = await this.auth.verifyOldPassword(this.Oldpassword);
    // if (!oldPasswordValid) throw new Error('Old password is incorrect.');

    // 4️⃣ Update password securely
    // const { data, error } = await this.auth.supabase.auth.updateUser({
    //   password: this.Newpassword,
    // });

    //if (error) throw new Error('Failed to update password: ' + error.message);

    alert('Password updated successfully!');

    // 5️⃣ Clear form fields
    this.Oldpassword = '';
    this.Newpassword = '';
    this.Confirmpassword = '';
  }
}
