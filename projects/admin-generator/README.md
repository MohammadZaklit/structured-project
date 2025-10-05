# Admin Generator Application

A comprehensive admin panel application built with Angular 20, PrimeNG, and Supabase for managing Projects, Modules, and Fields.

## Features

### Projects Management
- Create, read, update, and delete projects
- Table view with sorting and pagination
- Dialog-based forms for add/edit operations
- Confirmation dialogs for delete operations

### Modules Management
- Manage modules with project associations
- Filter by project and name
- Drag-and-drop row reordering (menu_order)
- Full CRUD operations with validation

### Fields Management
- Manage fields with module associations
- Filter by module, reference module, and name
- Field types: string, text, number, boolean, date, email, phone, etc.
- Optional reference module for relationships
- Drag-and-drop row reordering (display_order)
- Full CRUD operations

## Tech Stack

- **Frontend**: Angular 20 (standalone components)
- **UI Library**: PrimeNG 20.1.2 + Bootstrap 5
- **Database**: Supabase (PostgreSQL)
- **State Management**: Angular Services
- **Routing**: Angular Router with lazy loading

## Project Structure

\`\`\`
projects/admin-generator/src/app/
├── components/
│   ├── projects/
│   │   ├── projects.component.ts
│   │   ├── projects.component.html
│   │   └── projects.component.scss
│   ├── modules/
│   │   ├── modules.component.ts
│   │   ├── modules.component.html
│   │   └── modules.component.scss
│   └── fields/
│       ├── fields.component.ts
│       ├── fields.component.html
│       └── fields.component.scss
├── services/
│   ├── supabase.service.ts
│   ├── project.service.ts
│   ├── module.service.ts
│   └── field.service.ts
├── models/
│   ├── project.model.ts
│   ├── module.model.ts
│   └── field.model.ts
└── environments/
    └── environment.ts
\`\`\`

## Node.js API Scripts

Located in \`nodejs/\` folder:

- \`projects-api.js\` - CRUD operations for projects
- \`modules-api.js\` - List operations for modules
- \`fields-api.js\` - List operations for fields

### Usage Examples

\`\`\`bash
# Projects API
node nodejs/projects-api.js list
node nodejs/projects-api.js create "My Project"
node nodejs/projects-api.js get <project-id>
node nodejs/projects-api.js update <project-id> "Updated Name"
node nodejs/projects-api.js delete <project-id>

# Modules API
node nodejs/modules-api.js list

# Fields API
node nodejs/fields-api.js list
\`\`\`

## Build

\`\`\`bash
# Build the application
npx ng build admin-generator

# Output will be in dist/admin-generator/
\`\`\`

## Development

\`\`\`bash
# Serve the application
npx ng serve admin-generator
\`\`\`

## Database Schema Requirements

The application expects the following tables in Supabase:

### projects
- id (uuid, primary key)
- name (text)
- created_at (timestamp)
- updated_at (timestamp)

### modules
- id (uuid, primary key)
- name (text)
- path (text)
- project_id (uuid, foreign key to projects)
- menu_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

### fields
- id (uuid, primary key)
- name (text)
- label (text)
- module_id (uuid, foreign key to modules)
- type (text)
- reference_module_id (uuid, foreign key to modules, nullable)
- display_order (integer)
- created_at (timestamp)
- updated_at (timestamp)

## Features Implemented

✅ Professional UX/UI using Bootstrap grid and PrimeNG components
✅ Table views with sorting, pagination, and filtering
✅ Add/Edit/Delete functionality with dialog-based forms
✅ Filtration headers for Modules (by project and name)
✅ Filtration headers for Fields (by module, reference module, and name)
✅ Drag-and-drop sorting with API calls to save order
✅ Reusable standalone components
✅ Lazy-loaded routes
✅ Toast notifications for user feedback
✅ Confirmation dialogs for delete operations
✅ Form validation
✅ Node.js API scripts for command-line operations
✅ Supabase integration for data persistence

## Notes

- Forms use PrimeNG dialog components
- Navigation menu in app header for easy access
- All components are standalone (no NgModule)
- Services use async/await pattern
- Environment configuration for Supabase credentials
