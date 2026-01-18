import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { isMultiSelectComponent, migrationTimestamp } from '../../../shared/utils';

export interface MigrationDetails {
  moduleDetails: { id: number; name: string; label: string };
  fields: any[];
  removedFields: any[];
  isNewTable: boolean;
  withStaticFields: boolean;
  allModules: Array<{ id: number; name: string; label: string }>;
  migrationDir: string;
}

export interface DropMigrationOptions {
  tableName: string;
  columnName?: string;
  pivotTables?: string[];
  migrationDir?: string;
  hasForeignKey?: boolean;
  foreignKeyRef?: string | null;
}

interface PivotTable {
  name: string;
  up: string;
  down: string;
}

@Injectable()
export class MigrationGeneratorService {
  generateMigration(details: MigrationDetails): string {
    const {
      moduleDetails,
      fields,
      removedFields,
      isNewTable,
      withStaticFields,
      allModules,
      migrationDir,
    } = details;

    const tableName = moduleDetails.name;
    const upStatements: string[] = [];
    const downStatements: string[] = [];
    const pivotTables: PivotTable[] = [];

    // Add fields
    for (const field of fields) {
      let line = '';

      const refTable = field.referenceModuleId
        ? allModules.find((mod) => field.referenceModuleId === mod.id)?.name ||
          'modules'
        : '';

      if (isMultiSelectComponent(field.componentId)) {
        if (field.referenceModuleId) {
          // Create pivot table
          const pivotName = `${tableName}_${refTable}_rel`;
          const fieldTable = `${tableName}_id`;
          const fieldPivot = `${refTable}_id`;

          pivotTables.push({
            name: pivotName,
            up: `
        await knex.schema.createTable("${pivotName}", table => {
          table.integer("${fieldTable}")
            .unsigned()
            .references("id")
            .inTable("${tableName}")
            .onDelete("CASCADE")
            .index();

          table.integer("${fieldPivot}")
            .unsigned()
            .references("id")
            .inTable("${refTable}")
            .onDelete("CASCADE")
            .index();

          table.unique(["${fieldTable}", "${fieldPivot}"]);
        });
      `,
            down: `await knex.schema.dropTableIfExists("${pivotName}");`,
          });
        } else {
          line = `table.jsonb("${field.name}")`;
        }
      } else {
        line = this.mapType(field);

        if (field.referenceModuleId) {
          line += `
            .unsigned()
            .references("id")
            .inTable("${refTable}")
            .onDelete("SET NULL")
          `;
        }
      }

      if (line) {
        upStatements.push(line + ';');
        downStatements.unshift(`table.dropColumn("${field.name}");`);
      }
    }

    // Remove fields
    for (const field of removedFields) {
      upStatements.push(`table.dropColumn("${field.name}");`);
      downStatements.unshift(this.mapType(field) + ';');
    }

    // Generate file
    const timestamp = migrationTimestamp();
    const action = isNewTable ? 'create' : 'update';
    const fileName = `${timestamp}_${action}_${tableName}.js`;
    const filePath = path.join(migrationDir, fileName);

    if (withStaticFields && isNewTable) {
      upStatements.unshift('table.increments("id").primary();');
      upStatements.push('table.integer("sortOrder").notNullable().defaultTo(0);');
      upStatements.push('table.timestamps(true, true);');
    }

    const mainUp = isNewTable
      ? `
        await knex.schema.createTable("${tableName}", table => {
          ${upStatements.join('\n')}
        });
      `
      : `
        await knex.schema.alterTable("${tableName}", table => {
          ${upStatements.join('\n')}
        });
      `;

    const mainDown = isNewTable
      ? `await knex.schema.dropTableIfExists("${tableName}");`
      : `
        await knex.schema.alterTable("${tableName}", table => {
          ${downStatements.join('\n')}
        });
      `;

    const content = `
export async function up(knex) {
  ${mainUp}

  ${pivotTables.map((p) => p.up).join('\n')}
}

export async function down(knex) {
  ${pivotTables.map((p) => p.down).join('\n')}
  ${mainDown}
}
`;

    fs.writeFileSync(filePath, content.trim());
    return filePath;
  }

  generateDropMigration(options: DropMigrationOptions): string {
    const {
      tableName,
      columnName,
      pivotTables = [],
      migrationDir = './migrations',
      hasForeignKey = false,
      foreignKeyRef,
    } = options;

    const timestamp = migrationTimestamp();

    let action: string;
    let target: string;

    if (pivotTables.length > 0 && !columnName) {
      action = 'drop';
      target = tableName ? `${tableName}_and_relations` : 'pivot_tables';
    } else if (columnName) {
      action = 'drop_column';
      target = `${columnName}_from_${tableName}`;
    } else {
      action = 'drop_table';
      target = tableName;
    }

    const fileName = `${timestamp}_${action}_${target}.js`;
    const filePath = path.join(migrationDir, fileName);

    const pivotDropStatements = pivotTables
      .map((pt) => `  await knex.schema.dropTableIfExists("${pt}");`)
      .join('\n');

    let content: string;

    if (columnName) {
      const dropForeignKeyStatement = hasForeignKey
        ? `table.dropForeign("${columnName}");`
        : '';

      content = `
export async function up(knex) {
${pivotDropStatements ? pivotDropStatements + '\n' : ''}
  await knex.schema.alterTable("${tableName}", table => {
    ${dropForeignKeyStatement ? dropForeignKeyStatement + '\n    ' : ''}table.dropColumn("${columnName}");
  });
}

export async function down(knex) {

  // Pivot table recreation would require schema information
}
`;
    } else if (tableName) {
      content = `
export async function up(knex) {
${
  pivotDropStatements
    ? '  // Drop pivot tables first\n' + pivotDropStatements + '\n\n'
    : ''
}  // Drop main table
  await knex.schema.dropTableIfExists("${tableName}");
}

export async function down(knex) {
  // Table recreation would require schema information
  // This is a destructive migration - manual intervention required for rollback
}
`;
    } else {
      content = `
export async function up(knex) {
${pivotDropStatements}
}

export async function down(knex) {
  // Pivot table recreation would require schema information
  // This is a destructive migration - manual intervention required for rollback
}
`;
    }

    fs.writeFileSync(filePath, content.trim());
    return filePath;
  }

  private mapType(field: any): string {
    switch (field.componentId) {
      case 1:
        return `table.integer("${field.name}")`;
      case 10:
        return `table.string("${field.name}")`;
      case 20:
        return `table.boolean("${field.name}")`;
      default:
        return `table.string("${field.name}")`;
    }
  }
}
