export interface ModuleConfig {
  id: number;
  name: string;
  label: string;
  url?: string;
}

export interface FieldConfig {
  id: number;
  name: string;
  label: string;
  hint?: string;
  sortOrder: number;
  moduleId: number;
  componentId: number;
  referenceModuleId?: number;
  parentFieldId?: number;
  isDefault: number;
}
