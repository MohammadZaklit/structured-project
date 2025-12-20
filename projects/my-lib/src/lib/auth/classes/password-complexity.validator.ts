import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface NzPasswordComplexityOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

export function NzPasswordComplexityValidator(
  options: NzPasswordComplexityOptions = {},
): ValidatorFn {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = true,
  } = options;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) return null; // let required validator handle empty

    const errors: ValidationErrors = {};

    if (value.length < minLength) {
      errors['minLength'] = {
        requiredLength: minLength,
        actualLength: value.length,
      };
    }

    if (requireUppercase && !/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }

    if (requireLowercase && !/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }

    if (requireNumber && !/\d/.test(value)) {
      errors['number'] = true;
    }

    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`]/.test(value)) {
      errors['specialChar'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
