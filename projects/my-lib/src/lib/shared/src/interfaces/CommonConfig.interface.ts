import { NzFieldComponentType } from '@zak-lib/ui-library/elements/form-fields/form-field/field-component-type';

export interface NzModuleConfig {
  id: number;
  name: string;
  label: string;
  url?: string;
}

export interface NzModuleFieldConfig extends NzFormFieldInfo {
  id: number;
  sortOrder: number;
  moduleId: number;
  componentId: number;
  referenceModuleId?: number;
  parentFieldId?: number;
  isDefault: number;
  configuration: NzComponentConfiguration;
  label: string;
}

export type NzComponentConfiguration = NzFieldComponentType;

export interface NzFormFieldInfo {
  name: string;
  label: string;
  hint?: string;
}
