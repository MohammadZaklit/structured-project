export interface Field {
  id?: string;
  name: string;
  label: string;
  module_id: string;
  type: string;
  reference_module_id?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  module?: {
    id: string;
    name: string;
  };
  reference_module?: {
    id: string;
    name: string;
  };
}
