import { Routes } from '@angular/router';
import { RegisterCard } from '../../../my-lib/src/lib/composed/register-card/src/register-card';
import { LoginCard } from '../../../my-lib/src/lib/composed/login-card/src/login-card';
export const routes: Routes = [
  { path: 'register', component: RegisterCard },
  { path: 'login', component: LoginCard },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
