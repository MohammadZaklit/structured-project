# Angular Admin Generator

A comprehensive Angular workspace containing multiple projects including a powerful Admin Generator application for managing projects, modules, and fields with a professional UI.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.2.

## Projects in Workspace

This workspace contains the following Angular applications:

1. **admin-generator** - Admin interface for managing projects, modules, and fields
2. **my-first-app** - Sample application with authentication
3. **form-builder** - Dynamic form builder application
4. **authentication-page** - Authentication UI components
5. **my-lib** - Shared component library

## Admin Generator Application

The Admin Generator provides a complete CRUD interface for:
- **Projects Management** - Create and manage projects
- **Modules Management** - Define modules with paths and project associations
- **Fields Management** - Configure fields with types and module references

### Features
- Professional UI using Bootstrap grid and PrimeNG components
- Filterable tables with pagination and sorting
- Drag-and-drop row reordering
- Modal dialogs for add/edit operations
- Toast notifications and confirmation dialogs
- Supabase backend integration

## Development server

To start the admin generator application:

```bash
npm run start:admin
```

To start other applications:

```bash
npm start  # Starts my-first-app
npm run start:form-builder  # Starts form-builder
```

Once the server is running, open your browser and navigate to `https://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the admin generator:

```bash
npm run build
```

To build all projects including the library:

```bash
npm run build:all
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Database Setup

The Admin Generator uses Supabase for data persistence. Configure your Supabase credentials in the `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

The application requires the following tables:
- `projects` - Stores project information
- `modules` - Stores modules with project relationships and menu ordering
- `module_fields` - Stores field definitions with module relationships and display ordering
- `field_types` - Lookup table for available field types

The database migrations are automatically applied when the application starts.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
