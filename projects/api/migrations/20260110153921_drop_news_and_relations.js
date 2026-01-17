export async function up(knex) {
  // Drop pivot tables first
  await knex.schema.dropTableIfExists("news_categories_rel");

  // Drop main table
  await knex.schema.dropTableIfExists("news");
}

export async function down(knex) {
  // Table recreation would require schema information
  // This is a destructive migration - manual intervention required for rollback
}