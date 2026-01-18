export async function up(knex) {
  
        await knex.schema.createTable("news", table => {
          table.increments("id").primary();
table.string("title");
table.integer("sortOrder").notNullable().defaultTo(0);
table.timestamps(true, true);
        });
      

  
        await knex.schema.createTable("news_categories_rel", table => {
          table.integer("news_id")
            .unsigned()
            .references("id")
            .inTable("news")
            .onDelete("CASCADE")
            .index();

          table.integer("categories_id")
            .unsigned()
            .references("id")
            .inTable("categories")
            .onDelete("CASCADE")
            .index();

          table.unique(["news_id", "categories_id"]);
        });
      
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("news_categories_rel");
  await knex.schema.dropTableIfExists("news");
}