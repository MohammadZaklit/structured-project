export async function up(knex) {
  
        await knex.schema.createTable("categories", table => {
          table.increments("id").primary();
table.string("brief");
table.string("title");
table.integer("sortOrder").notNullable().defaultTo(0);
table.timestamps(true, true);
        });
      

  
}

export async function down(knex) {
  
  await knex.schema.dropTableIfExists("categories");
}