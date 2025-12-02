import { NzFormFieldLoaderConfig } from '@zak-lib/ui-library/elements/form-fields/form-field';

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
}

export interface NzWizardFormFieldConfig extends NzFormFieldLoaderConfig {
  step: number;
}
