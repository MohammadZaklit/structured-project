import { NzAutoComplete } from '@zak-lib/ui-library/elements/form-fields/autocomplete';
import { NzFieldConfig } from '@zak-lib/ui-library/shared';

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

export interface NzFormFieldConfig extends NzFieldConfig {
  type: NzFieldType;
  step: number;
  AutoComplete?: NzAutoComplete;
}

export type NzFieldType =
  | 'AutoComplete'
  | 'CascadeSelect'
  | 'Checkbox'
  | 'ColorPicker'
  | 'DatePicker'
  | 'FloatLabel'
  | 'IconField'
  | 'InputGroup'
  | 'InputMask'
  | 'InputNumber'
  | 'InputOtp'
  | 'KeyFilter'
  | 'Knob'
  | 'Listbox'
  | 'MultiSelect'
  | 'Password'
  | 'RadioButtonDB'
  | 'RadioButtonOptions'
  | 'Rating'
  | 'SelectButton'
  | 'Slider'
  | 'Textarea'
  | 'ToggleButton'
  | 'ToggleSwitch'
  | 'TreeSelectDB'
  | 'TreeSelectOptions'
  | 'Button'
  | 'SpeedDial'
  | 'SplitButton'
  | 'PickListDB'
  | 'PickListOptions'
  | 'FileUploadDragDrop'
  | 'FileUploadBrowse';
