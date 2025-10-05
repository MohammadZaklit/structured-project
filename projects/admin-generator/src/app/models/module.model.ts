export interface Module {
  id?: string;
  name: string;
  path: string;
  project_id: string;
  menu_order?: number;
  created_at?: string;
  updated_at?: string;
  project?: {
    id: string;
    name: string;
  };
}
