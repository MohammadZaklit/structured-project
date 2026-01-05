export interface NzModuleConfig {
  id: number;
  name: string;
  label: string;
  url?: string;
}
export interface NzModuleFieldConfig extends NzFormFieldInfo {
  id: number | null;
  sortOrder: number;
  moduleId: number;
  componentId: number;
  referenceModuleId?: number;
  parentFieldId?: number;
  isDefault: boolean;
  isDeleted: boolean;
  isFormField: boolean;
  configuration: NzFormFieldSettings;
}

export interface NzFormFieldInfo {
  name: string;
  label: string;
  hint?: string;
}
export interface NzFormFieldSettings {
  value?: any;
  isRequired?: boolean | ((formValue: any) => boolean);
  isDisabled?: boolean | ((formValue: any) => boolean);
  isVisible?: boolean | ((formValue: any) => boolean);
  apiValidate?: (value: any) => Promise<boolean>;
  extraProps?: any;
  placeholder?: string;
  pattern?: string;
  dataSource?: [];
  dataOptions?: [];
}

export type NzUiType = NzUiTypeEnum.Row | NzUiTypeEnum.Column;

export enum NzUiTypeEnum {
  Row = 'row',
  Column = 'column',
}

export interface NzComponentLoaderConfig {
  type: NzUiType;
  componentConfig: any;
}
