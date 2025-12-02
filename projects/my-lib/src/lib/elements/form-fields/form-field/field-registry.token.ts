import { InjectionToken } from '@angular/core';

export const NzFieldRegistry = new InjectionToken<Record<string, () => Promise<any>>>(
  'FIELD_REGISTRY',
);
