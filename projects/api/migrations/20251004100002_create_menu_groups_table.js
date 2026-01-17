export async function up(knex) {
  return knex.schema.createTable("menu_groups", (table) => {
    table.increments("id").primary();
    table.text("label").notNullable();
    table.integer("sortOrder").notNullable().defaultTo(0);
    table.timestamps(true, true); // created_at & updated_at
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("menu_groups");
}
