// seeds/01-modules.js
export async function seed(knex) {
  await knex("modules").insert([
    { id: 1, name: "module_field_types", label: "Field Types" },
    { id: 2, name: "modules", label: "Modules", menuGroupId: 2 },
    { id: 3, name: "module_fields", label: "Module Fields" },
    {
      id: 4,
      name: "menu_groups",
      label: "Menu Groups",
    },
    { id: 5, name: "users", label: "Users", menuGroupId: 3 },
  ]);
}
