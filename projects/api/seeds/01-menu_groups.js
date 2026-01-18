export async function seed(knex) {
  await knex("menu_groups").insert([
    { label: "Modules" },
    { label: "Users" },
    { label: "App" },
  ]);
}
