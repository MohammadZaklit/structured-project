/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("email").unique().notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.dropTable("users");
}
