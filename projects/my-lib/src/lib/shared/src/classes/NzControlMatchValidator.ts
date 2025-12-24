import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface MatchPasswordValidatorOptions {
  /** Name of the control to match with, e.g., 'newPassword' */
  matchControlName: string;
}

/**
 * Usage:
 * new FormControl('', [Validators.required, MatchPasswordValidator({ matchControlName: 'newPassword' })])
 */
export function MatchPasswordValidator(options: MatchPasswordValidatorOptions): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null; // FormGroup not initialized yet

    const matchControl = control.parent.get(options.matchControlName);
    if (!matchControl) return null;

    if (control.value !== matchControl.value) {
      return { mismatch: true };
    }

    return null;
  };
}
