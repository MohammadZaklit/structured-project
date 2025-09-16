import { Component } from '@angular/core';
import { RegisterCard } from '@zak-lib/ui-library/composed/register-card';
@Component({
  selector: 'app-register',
  imports: [RegisterCard],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {}
