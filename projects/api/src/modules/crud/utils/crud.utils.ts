import { Knex } from 'knex';

export interface ModuleDetails {
  id: number;
  name: string;
  label: string;
}

export interface ModuleField {
  id: number;
  name: string;
  label: string;
  hint?: string;
  componentId: number;
  referenceModuleId?: number;
  parentFieldId?: number;
}

export async function getModuleDetails(
  db: Knex,
  moduleName: string,
): Promise<ModuleDetails | undefined> {
  return db
    .select(['id', 'name', 'label'])
    .from('modules')
    .where('name', moduleName)
    .first();
}

export async function getAllModules(db: Knex): Promise<ModuleDetails[]> {
  return db.select(['id', 'name', 'label']).from('modules');
}

export async function getModuleFields(
  db: Knex,
  moduleId: number,
): Promise<ModuleField[]> {
  return db
    .select([
      'id',
      'name',
      'label',
      'hint',
      'componentId',
      'referenceModuleId',
      'parentFieldId',
    ])
    .from('module_fields')
    .where('isFormField', true)
    .where('moduleId', moduleId);
}

export function mapAndValidatePayload(
  payload: Record<string, any>,
  moduleFields: ModuleField[],
  isCreate = true,
): { mappedData: Record<string, any>; errors: string[] } {
  const mappedData: Record<string, any> = {};
  const errors: string[] = [];

  for (const field of moduleFields) {
    if (field.name in payload) {
      mappedData[field.name] = payload[field.name];
    }
  }

  return { mappedData, errors };
}
