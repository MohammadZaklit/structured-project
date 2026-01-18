// migration file: create_profiles.js
export async function up(knex) {
  await knex.schema.createTable("profiles", (table) => {
    table.uuid("id").primary(); // same UUID as auth.users.id
    table.text("userName").unique();
    table.text("avatarUrl");
    table.timestamps(true, true);

    // link to Supabase auth.users
    table
      .foreign("id")
      .references("id")
      .inTable("auth.users")
      .onDelete("cascade");
  });
}

export async function up(knex) {
  await knex.schema.dropTableIfExists("profiles");
}
