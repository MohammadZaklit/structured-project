import { InjectionToken } from '@angular/core';

export const FIELD_REGISTRY = new InjectionToken<Record<string, () => Promise<any>>>(
  'FIELD_REGISTRY',
);
