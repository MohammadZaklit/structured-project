import { NzComponentConfiguration } from '@zak-lib/ui-library/composed/component-configuration';
import { NzFieldTypeEnum } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { NzModuleConfig, NzUiTypeEnum } from '@zak-lib/ui-library/shared';

export interface NzFormBuilder {
  module: NzModuleConfig;
  components: NzComponentConfig[];
}
export interface NzComponentConfig extends NzComponentConfiguration {
  id: number;
  label: string;
  isNew: boolean;
  childComponents: NzComponentConfig[];
}

export interface FormBuilderComponent extends NzComponentConfig {
  rowid: string;
  childComponents: FormBuilderComponent[];
}

const NzUiTypeConst = { ...NzUiTypeEnum } as const;
const NzFieldTypeConst = { ...NzFieldTypeEnum } as const;
export const NzComponentTypeEnum = { ...NzUiTypeConst, ...NzFieldTypeConst };
