export interface NzModuleConfig {
  id: number;
  name: string;
  label: string;
  url?: string;
}

export interface NzFieldConfig extends NzFieldInfo {
  id: number;
  sortOrder: number;
  moduleId: number;
  componentId: number;
  referenceModuleId?: number;
  parentFieldId?: number;
  isDefault: number;
}

export interface NzFieldInfo {
  name: string;
  label: string;
  hint?: string;
}
