import { GenericRecord } from '../services/http.service';

export interface Project extends GenericRecord {
  project_name: string;
}
