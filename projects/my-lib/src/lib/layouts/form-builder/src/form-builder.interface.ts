import { NzComponentConfiguration } from '@zak-lib/ui-library/composed/component-configuration';
import { NzModuleConfig } from '@zak-lib/ui-library/shared';

export interface NzFormBuilder {
  module: NzModuleConfig;
  components: NzComponentConfiguration[];
}
