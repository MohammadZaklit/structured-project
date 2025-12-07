import { InjectionToken } from '@angular/core';

export const NzFieldRegistry = new InjectionToken<Record<string, () => Promise<any>>>(
  'FIELD_REGISTRY',
);
//It creates a unique Angular token used to register and later inject a map of field type
//  names → async loader functions, allowing your app to dynamically load form-field components.
