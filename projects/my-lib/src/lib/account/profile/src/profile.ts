import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzProfile } from './profile.interface';
import { NzFormControl } from '@zak-lib/ui-library/shared';
import { NzHeading, NzHeadingComponent } from '@zak-lib/ui-library/components/heading';
import { NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';
import { NzAccountService } from '../../services/account.service';
import { firstValueFrom } from 'rxjs';
import { NzName, NzNameComponent } from '@zak-lib/ui-library/components/name';
import { NzEmail, NzEmailComponent } from '@zak-lib/ui-library/components/email';

@Component({
  selector: 'nz-profile',
  standalone: true,
  styles: ``,
  imports: [
    FormsModule,
    NzHeadingComponent,
    NzNameComponent,
    NzEmailComponent,
    NzStandardButtonComponent,
  ],
  templateUrl: './profile.html',
})
export class NzProfileComponent implements OnInit {
  @Input() config!: NzProfile;
  private accountService = inject(NzAccountService);
  public headingConfig!: NzHeading;
  public nameconfig!: NzName;
  public emailconfig!: NzEmail;
  public saveConfig!: NzStandardButton;
  private alertService = inject(NzAlertDialogService);
  @Output() success = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.config.form.addControl('name', new NzFormControl(null, [Validators.required]));
    this.config.form.addControl(
      'email',
      new NzFormControl(null, [Validators.required, Validators.email]),
    );

    this.headingConfig = {
      id: 'headingconfig',
      label: 'Update Your Profile',
      style: 'h1',
    };
    this.nameconfig = {
      name: 'name',
      label: 'Full Name',
      settings: {
        placeholder: 'Enter your full name',
      },
      control: this.config.form.get('name') as NzFormControl,
      form: this.config.form,
    };
    this.emailconfig = {
      name: 'email',
      label: 'Email',
      settings: {
        placeholder: 'Enter your email address',
      },
      control: this.config.form.get('email') as NzFormControl,
      form: this.config.form,
    };

    this.saveConfig = {
      id: 'gotoregister',
      label: 'Update Profile',
      onclick: () => {
        this.save();
      },
    };
  }

  async save(): Promise<void> {
    const data = this.config.form.getRawValue();

    try {
      const response = await firstValueFrom(this.accountService.updateProfile(data));
      if (response) {
        // Emit success dialog config
        this.success.emit();
        this.alertService.openDialog({
          type: 'success',
          title: 'Success',
          message: 'Your profile is updated successfully.',
        });
      }
    } catch (err: any) {
      this.alertService.openDialog({
        type: 'error',
        title: 'Error',
        message: err?.error?.message || 'Failed to update password',
      });
    }
  }
}
