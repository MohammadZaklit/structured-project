import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { isMultiSelectComponent } from '../../shared/utils';
import {
  getModuleDetails,
  getModuleFields,
  mapAndValidatePayload,
  getAllModules,
} from './utils/crud.utils';

@Injectable()
export class CrudService {
  constructor(private databaseService: DatabaseService) {}

  private get db() {
    return this.databaseService.db;
  }

  async createRecord(moduleName: string, payload: Record<string, any>) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    const moduleFields = await getModuleFields(this.db, moduleDetails.id);
    const nonRelFields = moduleFields.filter(
      (fld) =>
        (isMultiSelectComponent(fld.componentId) && !fld.referenceModuleId) ||
        !isMultiSelectComponent(fld.componentId),
    );

    const { mappedData, errors } = mapAndValidatePayload(payload, nonRelFields, true);

    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
    }

    const [id] = await this.db(moduleName).insert(mappedData).returning('id');
    const getFields = nonRelFields.map((field) => field.name);
    const insertedRow = await this.getRow(
      moduleName,
      this.getModuleAllFields(moduleName, getFields),
      id.id,
    );

    if (
      moduleFields.some((fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId)
    ) {
      const manyToManyFields = moduleFields.filter(
        (fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId,
      );
      await this.saveManyToManyRecord(moduleName, manyToManyFields, insertedRow.id, payload);
    }
    return insertedRow;
  }

  async getRecords(moduleName: string, searchParams: Record<string, any> = {}) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    const moduleFields = await getModuleFields(this.db, moduleDetails.id);
    const nonRelFields = moduleFields.filter(
      (fld) =>
        (isMultiSelectComponent(fld.componentId) && !fld.referenceModuleId) ||
        !isMultiSelectComponent(fld.componentId),
    );

    const getFields = nonRelFields.map((field) => field.name);
    const newGetFields = this.getModuleAllFields(moduleName, getFields);

    const queryObj = this.db.select(newGetFields);
    for (const field of moduleFields) {
      if (field.name in searchParams) {
        if (searchParams[field.name] === 'NOT_NULL') {
          queryObj.whereNotNull(field.name);
        } else if (searchParams[field.name] === 'NULL') {
          queryObj.whereNull(field.name);
        } else {
          queryObj.where(field.name, searchParams[field.name]);
        }
      }
    }

    const records = await queryObj.from(moduleName).orderBy('sortOrder', 'ASC');

    if (
      records.length > 0 &&
      moduleFields.some((fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId)
    ) {
      const manyToManyFields = moduleFields.filter(
        (fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId,
      );

      const newRows = await Promise.all(
        records.map((row) => this.getManyToManyRowData(moduleName, row, manyToManyFields)),
      );

      return newRows;
    }

    return records;
  }

  async getRecord(moduleName: string, id: number) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    const moduleFields = await getModuleFields(this.db, moduleDetails.id);
    const nonRelFields = moduleFields.filter(
      (fld) =>
        (isMultiSelectComponent(fld.componentId) && !fld.referenceModuleId) ||
        !isMultiSelectComponent(fld.componentId),
    );
    const getFields = nonRelFields.map((field) => field.name);
    const fields = this.getModuleAllFields(moduleName, getFields);

    if (
      moduleFields.some((fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId)
    ) {
      const row = await this.getRow(moduleName, fields, id);
      const manyToManyFields = moduleFields.filter(
        (fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId,
      );

      return this.getManyToManyRowData(moduleName, row, manyToManyFields);
    }

    return this.getRow(moduleName, fields, id);
  }

  async getRecordRaw(moduleName: string, id: number) {
    return this.db(moduleName).where('id', id).first();
  }

  async updateRecord(moduleName: string, recordId: number, payload: Record<string, any>) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    const moduleFields = await getModuleFields(this.db, moduleDetails.id);

    const nonRelFields = moduleFields.filter(
      (fld) =>
        (isMultiSelectComponent(fld.componentId) && !fld.referenceModuleId) ||
        !isMultiSelectComponent(fld.componentId),
    );

    const { mappedData, errors } = mapAndValidatePayload(payload, nonRelFields, true);

    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
    }

    const [id] = await this.db(moduleName).where('id', recordId).update(mappedData).returning('id');
    const getFields = nonRelFields.map((field) => field.name);
    const insertedRow = await this.getRow(
      moduleName,
      this.getModuleAllFields(moduleName, getFields),
      id.id,
    );

    if (
      moduleFields.some((fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId)
    ) {
      const manyToManyFields = moduleFields.filter(
        (fld) => isMultiSelectComponent(fld.componentId) && fld.referenceModuleId,
      );
      await this.saveManyToManyRecord(moduleName, manyToManyFields, insertedRow.id, payload);
    }

    return insertedRow;
  }

  async deleteRecord(moduleName: string, recordId: number) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    await this.db(moduleName).where('id', recordId).delete();
    return true;
  }

  async sortRecords(
    moduleName: string,
    payload: { page: number; rows: Array<{ id: number; sortOrder: number }> },
  ) {
    const moduleDetails = await getModuleDetails(this.db, moduleName);
    if (!moduleDetails) {
      throw new BadRequestException(`Module '${moduleName}' not found.`);
    }

    const { page, rows } = payload;

    if (!page || !Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('Page number and records are required to sort.');
    }

    const caseStatement = this.db.raw(
      `CASE ${rows.map(() => `WHEN id = ? THEN ?`).join(' ')} END::integer`,
      rows.flatMap((r) => [r.id, r.sortOrder * page]),
    );

    await this.db(moduleName)
      .whereIn(
        'id',
        rows.map((r) => r.id),
      )
      .update({ sortOrder: caseStatement });

    return true;
  }

  async saveMedia(fileData: any, metadata: any = {}) {
    if (!fileData) {
      throw new BadRequestException('No file data provided.');
    }

    const [record] = await this.db('media')
      .insert({
        original_name: fileData.originalname,
        filename: fileData.filename,
        path: fileData.path,
        mime_type: fileData.mimetype,
        size: fileData.size,
        language: metadata.language,
        related_module: metadata.relatedModule,
        related_record_id: metadata.relatedId,
        created_at: new Date(),
      })
      .returning('*');

    return record;
  }

  private async getManyToManyRowData(moduleName: string, row: any, fields: any[]) {
    const allModules = await getAllModules(this.db);
    for (const field of fields) {
      const relModuleName = allModules.find((mod) => mod.id === field.referenceModuleId)?.name;

      if (relModuleName) {
        const pivotTable = `${moduleName}_${relModuleName}_rel`;
        const fieldId = `${moduleName}_id`;
        const pivotId = `${relModuleName}_id`;
        row[field.name] = await this.db(relModuleName)
          .join(pivotTable, `${pivotTable}.${pivotId}`, `${relModuleName}.id`)
          .where(`${pivotTable}.${fieldId}`, row.id)
          .select(`${relModuleName}.*`);
      } else {
        row[field.name] = [];
      }
    }

    return row;
  }

  private async getRow(moduleName: string, getFields: string[], id: number) {
    return this.db.select(getFields).where('id', id).from(moduleName).first();
  }

  private getModuleAllFields(moduleName: string, fields: string[]): string[] {
    if (moduleName !== '') {
      fields.push('id');
      return fields;
    }
    return fields;
  }

  private async saveManyToManyRecord(
    mainTable: string,
    fields: any[],
    rowid: number,
    payload: Record<string, any>,
  ) {
    const allModules = await getAllModules(this.db);
    for (const field of fields) {
      const data = payload[field.name];
      if (!data) continue;

      const relTable = allModules.find((mod) => mod.id === field.referenceModuleId)?.name;
      if (!relTable) continue;

      const pivotTable = `${mainTable}_${relTable}_rel`;
      const mainColId = `${mainTable}_id`;
      const relColId = `${relTable}_id`;
      const relatedIds = data.map((obj: any) => obj.id);
      await this.saveManyToMany(pivotTable, mainColId, rowid, relColId, relatedIds);
    }
  }

  private async saveManyToMany(
    pivotTable: string,
    mainColumn: string,
    mainId: number,
    relatedColumn: string,
    relatedIds: number[] = [],
  ) {
    if (!pivotTable || !mainColumn || !mainId || !relatedColumn) {
      throw new BadRequestException('Missing required parameters for Many-to-Many save.');
    }

    await this.db.transaction(async (trx) => {
      const existingRows = await trx(pivotTable).where(mainColumn, mainId).select(relatedColumn);

      const existingIds = new Set(existingRows.map((row) => row[relatedColumn]));
      const newIds = new Set(relatedIds);

      const toInsert = relatedIds
        .filter((id) => !existingIds.has(id))
        .map((id) => ({
          [mainColumn]: mainId,
          [relatedColumn]: id,
        }));

      const toDelete = [...existingIds].filter((id) => !newIds.has(id));

      if (toDelete.length > 0) {
        await trx(pivotTable).where(mainColumn, mainId).whereIn(relatedColumn, toDelete).delete();
      }

      if (toInsert.length > 0) {
        await trx(pivotTable).insert(toInsert);
      }
    });

    return true;
  }
}
