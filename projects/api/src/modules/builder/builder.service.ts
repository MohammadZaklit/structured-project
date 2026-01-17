import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { DatabaseService } from '../../shared/database/database.service';
import { MigrationGeneratorService } from './services/migration-generator.service';
import { isMultiSelectComponent } from '../../shared/utils';

export interface ModuleField {
  id: number | null;
  parentFieldId?: number | null;
  label: string;
  moduleId: number;
  componentId: number;
  sortOrder: number;
  referenceModuleId?: number | null;
  name: string;
  hint?: string;
  isFormField?: boolean;
  isDeleted?: boolean;
  configuration?: any;
  children?: ModuleField[];
}

export interface ModuleInfo {
  id: number;
  name: string;
  label: string;
}

@Injectable()
export class BuilderService {
  constructor(
    private databaseService: DatabaseService,
    private migrationGeneratorService: MigrationGeneratorService,
  ) {}

  private get db() {
    return this.databaseService.db;
  }

  async saveFields(fields: ModuleField[]) {
    await this.db.transaction(async (trx) => {
      const bulkInsert = async (rows: any[]) => {
        return trx('module_fields').insert(rows).returning(['id']);
      };

      const bulkUpdate = async (rows: any[]) => {
        for (const row of rows) {
          const { id, ...updateData } = row;
          await trx('module_fields').where({ id }).update(updateData);
        }
      };

      const saveTree = async (
        components: ModuleField[],
        parentId: number | null = null,
      ) => {
        if (!components || !components.length) return;

        const newItems: ModuleField[] = [];
        const existingItems: ModuleField[] = [];

        for (const c of components) {
          if (c.id === 0 || c.id === null) {
            newItems.push(c);
          } else if (c.id && c.id > 0) {
            existingItems.push(c);
          }
        }

        // Insert new items
        if (newItems.length) {
          const insertPayload = newItems.map((c) => ({
            parentFieldId: parentId,
            label: c.label,
            moduleId: c.moduleId,
            componentId: c.componentId,
            sortOrder: c.sortOrder,
            referenceModuleId: c.referenceModuleId,
            name: c.name,
            hint: c.hint,
            isFormField: c.isFormField,
            configuration: JSON.stringify(c.configuration || {}),
          }));

          const insertedRows = await bulkInsert(insertPayload);

          insertedRows.forEach((row, index) => {
            newItems[index].id = row.id;
          });
        }

        // Update existing items
        if (existingItems.length) {
          const updatePayload = existingItems.map((c) => ({
            id: c.id,
            parentFieldId: parentId,
            moduleId: c.moduleId,
            componentId: c.componentId,
            sortOrder: c.sortOrder,
            isDeleted: c.isDeleted,
            referenceModuleId: c.referenceModuleId,
            label: c.label,
            name: c.name,
            isFormField: c.isFormField,
            configuration: JSON.stringify(c.configuration || {}),
          }));

          await bulkUpdate(updatePayload);
        }

        // Recurse for children
        for (const c of components) {
          if (Array.isArray(c.children) && c.children.length) {
            await saveTree(c.children, c.id);
          }
        }
      };

      await saveTree(fields);
    });

    return { message: 'Success' };
  }

  async migrate(module: ModuleInfo) {
    const moduleDetails = await this.getModuleDetails(module.name);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${module.name}' not found.`);
    }

    const moduleFields = await this.getModuleFields(moduleDetails.id);

    const flds: any[] = [];
    const removedFields: any[] = [];
    const hasTable = await this.db.schema.hasTable(module.name);

    moduleFields.forEach((fld) => {
      if (fld.isDeleted) {
        removedFields.push(fld);
      } else {
        flds.push(fld);
      }
    });

    const columns = await this.db(module.name).columnInfo();
    const columnNames = Object.keys(columns);

    const migrationDir = './projects/api/migrations';
    const fields = flds.filter((fld) => !columnNames.includes(fld.name));
    const allModules = fields.some((fld) => fld.referenceModuleId)
      ? await this.getAllModules()
      : [];

    if (fields.length > 0) {
      const migrationDetails = {
        moduleDetails,
        fields,
        removedFields,
        isNewTable: !hasTable,
        withStaticFields: true,
        allModules,
        migrationDir,
      };

      const filePath =
        this.migrationGeneratorService.generateMigration(migrationDetails);

      try {
        await this.db.migrate.latest();
      } catch (error) {
        await fs.promises.unlink(filePath);
        throw new BadRequestException('Error migrating database');
      }

      return { message: 'Success' };
    }

    throw new BadRequestException('Empty Fields');
  }

  async generateDropMigration(
    type: 'module' | 'field',
    record: any,
  ): Promise<string> {
    const migrationDir = './projects/api/migrations';
    const allModules = await this.getAllModules();

    if (type === 'module') {
      const moduleFields = await this.db('module_fields')
        .where('moduleId', record.id)
        .whereNotNull('referenceModuleId');

      const pivotTables: string[] = [];
      for (const field of moduleFields) {
        if (isMultiSelectComponent(field.componentId)) {
          const refModule = allModules.find(
            (m) => m.id === field.referenceModuleId,
          );
          if (refModule) {
            pivotTables.push(`${record.name}_${refModule.name}_rel`);
          }
        }
      }

      const referencingFields = await this.db('module_fields').where(
        'referenceModuleId',
        record.id,
      );

      for (const field of referencingFields) {
        if (isMultiSelectComponent(field.componentId)) {
          const ownerModule = allModules.find((m) => m.id === field.moduleId);
          if (ownerModule) {
            pivotTables.push(`${ownerModule.name}_${record.name}_rel`);
          }
        }
      }

      const filePath = this.migrationGeneratorService.generateDropMigration({
        tableName: record.name,
        pivotTables,
        migrationDir,
      });

      await this.db.migrate.latest();
      return filePath;
    } else if (type === 'field') {
      const moduleDetails = await this.db('modules')
        .where('id', record.moduleId)
        .first();

      if (!moduleDetails) {
        throw new BadRequestException(
          `Module with id '${record.moduleId}' not found.`,
        );
      }

      const pivotTables: string[] = [];
      let hasForeignKey = false;
      let foreignKeyRef: string | null = null;

      const isManyToMany =
        isMultiSelectComponent(record.componentId) && record.referenceModuleId;

      if (isManyToMany) {
        const refModule = allModules.find(
          (m) => m.id === record.referenceModuleId,
        );
        if (refModule) {
          pivotTables.push(`${moduleDetails.name}_${refModule.name}_rel`);
        }
      } else if (record.referenceModuleId) {
        hasForeignKey = true;
        const refModule = allModules.find(
          (m) => m.id === record.referenceModuleId,
        );
        if (refModule) {
          foreignKeyRef = refModule.name;
        }
      }

      const filePath = this.migrationGeneratorService.generateDropMigration({
        tableName: moduleDetails.name,
        columnName: isManyToMany ? undefined : record.name,
        pivotTables,
        migrationDir,
        hasForeignKey,
        foreignKeyRef,
      });

      await this.db.migrate.latest();
      return filePath;
    }

    throw new BadRequestException(`Invalid drop migration type: ${type}`);
  }

  private async getModuleDetails(moduleName: string) {
    return this.db
      .select(['id', 'name', 'label'])
      .from('modules')
      .where('name', moduleName)
      .first();
  }

  private async getModuleFields(moduleId: number) {
    return this.db
      .select([
        'id',
        'name',
        'label',
        'hint',
        'componentId',
        'referenceModuleId',
        'parentFieldId',
        'isDeleted',
      ])
      .from('module_fields')
      .where('moduleId', moduleId);
  }

  private async getAllModules(): Promise<ModuleInfo[]> {
    return this.db.select(['id', 'name', 'label']).from('modules');
  }
}
