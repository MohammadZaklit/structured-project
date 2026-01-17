/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("module_fields", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("label").notNullable();
    table.text("hint").nullable();
    table.integer("sortOrder").notNullable().defaultTo(0);
    table.tinyint("isDefault").notNullable().defaultTo(0);
    table.boolean("isFormField").notNullable().defaultTo(false);
    table.boolean("isDeleted").notNullable().defaultTo(false);
    table
      .integer("moduleId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("componentId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("module_components")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .integer("referenceModuleId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("modules")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .integer("parentFieldId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("module_fields")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table.unique(["name", "moduleId"], {
      indexName: "module_fields_unique_form_fields",
      predicate: (qb) => qb.where("isFormField", true),
    });
    table.timestamps(true, true); // created_at & updated_at
    table.jsonb("configuration").nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.dropTable("module_fields");
}
