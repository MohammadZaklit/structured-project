/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const hasPassword = await knex.schema.hasColumn("users", "password");
  if (!hasPassword) {
    await knex.schema.alterTable("users", function (table) {
      table.string("password");
      table.string("reset_password_token");
      table.bigInteger("reset_password_expires");
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("password");
    table.dropColumn("reset_password_token");
    table.dropColumn("reset_password_expires");
  });
}
