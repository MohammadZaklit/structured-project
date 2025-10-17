export interface ModuleConfig {
  id: number;
  name: string;
  label: string;
  url?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
}
