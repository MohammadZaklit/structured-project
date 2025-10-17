export interface StepperConfig {
  steps: StepConfig[];
}

export interface StepConfig {
  id: number;
  label: string;
  name: string;
  icon?: string;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: string;
  step: number;
  placeholder?: string;
  value?: any;
  options?: any[];
  required?: boolean | ((formValue: any) => boolean);
  disabled?: boolean | ((formValue: any) => boolean);
  visible?: boolean | ((formValue: any) => boolean);
  pattern?: string;
  apiValidate?: (value: any) => Promise<boolean>;
  extraProps?: any;
}
