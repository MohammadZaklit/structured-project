/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("module_components", (table) => {
    table.increments("id").primary();
    table.text("componentName").notNullable();
    table
      .enum("dbType", [
        // String types
        "varchar",
        "char",
        "text",
        "tinytext",
        "mediumtext",
        "longtext",
        // Numeric types
        "int",
        "tinyint",
        "smallint",
        "mediumint",
        "bigint",
        "decimal",
        "numeric",
        "float",
        "double",
        "real",
        // Date and time types
        "date",
        "datetime",
        "timestamp",
        "time",
        "year",
        // Binary types
        "binary",
        "varbinary",
        "blob",
        "tinyblob",
        "mediumblob",
        "longblob",
        // Boolean
        "boolean",
        "bool",
        // JSON
        "json",
        "jsonb",
        // UUID
        "uuid",
        // Enum (for creating enum fields)
        "enum",
        // Relationship types
        "foreign_key",
        "many_to_many",
        // Others
        "ui",
      ])
      .notNullable();
    table.text("label").notNullable();
    table.timestamps(true, true); // created_at & updated_at
    table.unique("componentName");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.dropTable("module_components");
}
