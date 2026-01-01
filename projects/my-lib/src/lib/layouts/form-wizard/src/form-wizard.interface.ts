import { NzFormFieldLoaderConfig } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { NzComponentLoaderConfig } from '@zak-lib/ui-library/shared';

export interface NzStepperConfig {
  steps: NzStepConfig[];
  backBtn?: {
    btnCallback: () => Promise<void>;
    position: 'top' | 'inline';
  };
}

export interface NzStepConfig {
  id: number;
  label: string;
  name: string;
  icon?: string;
  components: NzWizardFormFieldConfig[];
}

export type NzWizardFormFieldConfig = (NzFormFieldLoaderConfig | NzComponentLoaderConfig) & {
  children?: NzWizardFormFieldConfig[];
};
