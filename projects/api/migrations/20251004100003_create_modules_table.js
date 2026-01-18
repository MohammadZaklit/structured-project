export async function up(knex) {
  return knex.schema.createTable("modules", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("label").notNullable();
    table.text("url").nullable();
    table
      .integer("menuGroupId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("menu_groups")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table.integer("sortOrder").notNullable().defaultTo(0);
    table.timestamps(true, true); // created_at & updated_at
    table.unique("name");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("modules");
}
