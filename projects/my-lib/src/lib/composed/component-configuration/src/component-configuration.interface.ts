import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { NzUiType } from '@zak-lib/ui-library/shared';

export interface NzComponentConfiguration {
  type: NzComponentType;
  configuration: Record<string, any>; //TypeScript guarantees it’s an object
}

export type NzComponentType = NzFieldType | NzUiType;
