import { NzComponentConfiguration } from '@zak-lib/ui-library/composed/component-configuration';
import { NzModuleConfig } from '@zak-lib/ui-library/shared';

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
