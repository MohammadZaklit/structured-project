import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragulaWrapperModule } from './dragula-wrapper.module';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for better type safety
interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select, radio, checkbox
  value?: any;
  // A field can itself be a row definition for nesting!
  nestedRow?: FormRow;
}

interface FormColumn {
  id: string; // Unique ID for column
  fields: FormField[];
  width?: number; // e.g., for custom column widths (not fully implemented here)
}

interface FormRow {
  id: string; // Unique ID for the row
  columns: FormColumn[];
  tempNumColumns?: number; // Temporary property for new row column selection (now unused)
}

@Component({
  selector: 'app-root',
  standalone: true, // Use standalone for a modern Angular component setup
  imports: [FormsModule, CommonModule, DragulaModule], // ✅ Directly import DragulaModule
  providers: [DragulaService], // ✅ Service provider
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('form-builder');

  public bagFieldsName: string;
  public bagFormBuilderName: string;

  private subs = new Subscription();

  // Left palette of available fields
  availableFields: FormField[] = [
    { id: 'row', type: 'row', label: 'Row' },
    { id: 'column', type: 'column', label: 'Column' },
    { id: 'text-input', type: 'text', label: 'Text Input', placeholder: 'Enter text' },
    { id: 'number-input', type: 'number', label: 'Number Input', placeholder: 'Enter number' },
    { id: 'textarea-input', type: 'textarea', label: 'Textarea', placeholder: 'Enter long text' },
    {
      id: 'checkbox-input',
      type: 'checkbox',
      label: 'Checkbox',
      options: [{ value: 'option1', label: 'Option 1' }],
    },
    {
      id: 'radio-input',
      type: 'radio',
      label: 'Radio Button',
      options: [{ value: 'radio1', label: 'Radio 1' }],
    },
    {
      id: 'select-input',
      type: 'select',
      label: 'Dropdown',
      options: [{ value: 'opt1', label: 'Option A' }],
    },
    { id: 'date-input', type: 'date', label: 'Date Picker' },
    { id: 'button-input', type: 'button', label: 'Button' },
  ];

  // Middle container: Represents the structure of the built form
  droppedRows: FormRow[] = [];
  // Right container: Currently selected field for customization
  selectedField: FormField | null = null;

  // We no longer need selectedRowIndex/selectedColIndex as they are index-based and misleading in nested scenarios
  // We'll use a field-specific lookup instead when deleting.

  constructor(
    private dragulaService: DragulaService,
    private cd: ChangeDetectorRef,
  ) {
    const instanceId = uuidv4();
    this.bagFieldsName = `BAG_FIELDS_${instanceId}`;
    this.bagFormBuilderName = `BAG_FORM_BUILDER_${instanceId}`;

    // create one bag only
    this.dragulaService.createGroup(this.bagFieldsName, {
      copy: (_el?: Element, source?: Element) =>
        source?.classList.contains('form-field-palette') ?? false,
      copyItem: (item: any) => JSON.parse(JSON.stringify(item)),
      accepts: (_el?: Element, target?: Element, _source?: Element) => {
        return (
          (target?.classList.contains('form-builder-area') ||
            target?.classList.contains('form-row-container') || // Accept rows and columns
            target?.classList.contains('form-column')) ??
          false
        );
      },
    });
  }

  ngOnInit(): void {
    const savedForm = localStorage.getItem('savedFormData');
    if (savedForm) {
      this.droppedRows = JSON.parse(savedForm);
    }
    // dropModel for the same bag
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFieldsName)
        .subscribe(({ target, source, item }: any) => {
          // Only handle drops from the palette
          if (source.classList.contains('form-field-palette')) {
            // 1. Dropping a ROW into the main form area
            if (item.type === 'row' && target.classList.contains('form-builder-area')) {
              const newRowId = uuidv4();
              // A row is initialized with ZERO columns (user must add them)
              this.droppedRows.push({
                id: newRowId,
                columns: [],
              });
              this.cd.detectChanges();
              return; // Stop processing
            }

            // 2. Dropping a COLUMN into a ROW container (main or nested)
            else if (item.type === 'column' && target.classList.contains('form-row-container')) {
              // CRITICAL FIX: Find the specific row object (main or nested) by traversing the model
              const row = this.findRowByDomElement(target);

              if (row) {
                // Create a new column object
                const newCol: FormColumn = {
                  id: uuidv4(),
                  fields: [],
                };

                // Add it to the correct row's columns array
                row.columns.push(newCol);
                this.cd.detectChanges();
              }
              return; // Stop processing
            }

            // 3. Dropping fields or a ROW for nesting into a COLUMN
            else if (target.classList.contains('form-column')) {
              // Find the correct row ID and column ID from the DOM element
              const rowId = target.getAttribute('data-row-id');
              const colId = target.getAttribute('data-col-id');

              if (!rowId || !colId) {
                console.error('Dropped field into column, but row/col IDs are missing.');
                return;
              }

              let fieldToAdd: FormField = item;

              if (item.type === 'row') {
                // Handle nested row creation: The 'row' field is dropped into a column
                const newNestedRowId = uuidv4();
                const nestedRowStructure: FormRow = {
                  id: newNestedRowId,
                  columns: [], // Nested row also starts with NO columns
                };

                // Create a field wrapper for the nested row structure
                fieldToAdd = {
                  id: uuidv4(),
                  type: 'nested-row-container', // New type to distinguish
                  label: 'Nested Row',
                  nestedRow: nestedRowStructure,
                };
              } else {
                // Standard field - Ensure it has a unique ID
                // Deep copy is handled by copyItem/dragula, but ensure unique ID for fields dropped from palette
                fieldToAdd.id = uuidv4();
              }

              // Find the target column in the model
              const targetCol = this.findColumnById(this.droppedRows, rowId, colId);

              if (targetCol) {
                // Dragula handles the DOM movement, we just need to ensure the model is updated
                targetCol.fields.push(fieldToAdd);
                this.cd.detectChanges();
              }
            }
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.bagFieldsName);
    this.dragulaService.destroy(this.bagFormBuilderName);
  }

  // --- Recursive Model Finders ---

  // Recursive search to find a row by its unique ID
  private findRowById(rows: FormRow[], rowId: string): FormRow | undefined {
    for (const row of rows) {
      if (row.id === rowId) return row;
      // Check for nested rows inside columns
      for (const col of row.columns) {
        for (const field of col.fields) {
          if (field.nestedRow) {
            const found = this.findRowById([field.nestedRow], rowId);
            if (found) return found;
          }
        }
      }
    }
    return undefined;
  }

  // Helper function to find a row (main or nested) object by its DOM element
  private findRowByDomElement(element: Element): FormRow | undefined {
    const container = element.closest('.form-row-container');
    if (!container) return undefined;

    const rowId = container.getAttribute('data-row-id');
    if (!rowId) return undefined;

    return this.findRowById(this.droppedRows, rowId);
  }

  // Recursive search to find a column by its parent row ID and column ID
  private findColumnById(
    rows: FormRow[],
    parentRowId: string,
    columnId: string,
  ): FormColumn | undefined {
    for (const row of rows) {
      if (row.id === parentRowId) {
        return row.columns.find((col) => col.id === columnId);
      }
      // Check for nested rows
      for (const col of row.columns) {
        for (const field of col.fields) {
          if (field.nestedRow) {
            const found = this.findColumnById([field.nestedRow], parentRowId, columnId);
            if (found) return found;
          }
        }
      }
    }
    return undefined;
  }

  // Recursive search to find the parent column of a field
  private findParentColumnOfField(rows: FormRow[], fieldToFind: FormField): FormColumn | null {
    for (const row of rows) {
      for (const col of row.columns) {
        if (col.fields.includes(fieldToFind)) {
          return col;
        }
        // Check for nested rows
        for (const field of col.fields) {
          if (field.nestedRow) {
            const parent = this.findParentColumnOfField([field.nestedRow], fieldToFind);
            if (parent) return parent;
          }
        }
      }
    }
    return null;
  }

  // --- Layout Manipulation Methods ---

  removeRow(rowId: string): void {
    const deleteRecursive = (rows: FormRow[]): boolean => {
      const initialLength = rows.length;
      // Remove from the current array
      const newRows = rows.filter((row) => row.id !== rowId);
      if (newRows.length < initialLength) {
        // If we found and deleted it at this level, update the array
        rows.splice(0, rows.length, ...newRows); // Replace content of the array
        return true;
      }

      // If not found, check nested rows
      for (const row of rows) {
        for (const col of row.columns) {
          for (const field of col.fields) {
            if (field.nestedRow) {
              if (deleteRecursive([field.nestedRow])) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    if (confirm('Are you sure you want to delete this row and all its contents?')) {
      deleteRecursive(this.droppedRows);
      // Clear selection if the selected field was in this row
      if (this.selectedField) {
        // A simple way to clear selection after deletion: if selectedField is no longer in model
        this.selectField(this.selectedField); // Tries to re-select, which should fail if deleted
      }
      this.cd.detectChanges();
    }
  }

  removeColumn(parentRowId: string, columnId: string): void {
    if (confirm('Are you sure you want to delete this column and all its contents?')) {
      const row = this.findRowById(this.droppedRows, parentRowId);

      if (row) {
        // Find the column by ID and remove it
        const initialLength = row.columns.length;
        row.columns = row.columns.filter((col) => col.id !== columnId);

        if (row.columns.length < initialLength) {
          // Deletion occurred
          // Clear selection if the selected field was in this column
          if (this.selectedField) {
            const parentCol = this.findParentColumnOfField(this.droppedRows, this.selectedField);
            if (!parentCol || parentCol.id === columnId) {
              // If the selected field's parent column was the one deleted
              this.selectedField = null;
            }
          }
          this.cd.detectChanges();
        } else {
          console.error(`Column with ID ${columnId} not found in row ${parentRowId}`);
        }
      } else {
        console.error(`Row with ID ${parentRowId} not found.`);
      }
    }
  }

  // --- Selection and Deletion Methods ---

  // Recursive function to find the field and its parent column
  private findFieldAndParentColumn(
    rows: FormRow[],
    fieldToFind: FormField,
  ): { field: FormField; parentColumn: FormColumn } | null {
    for (const row of rows) {
      for (const col of row.columns) {
        for (const field of col.fields) {
          if (field === fieldToFind) {
            return { field: field, parentColumn: col };
          }
          // Check nested rows
          if (field.nestedRow) {
            const result = this.findFieldAndParentColumn([field.nestedRow], fieldToFind);
            if (result) return result;
          }
        }
      }
    }
    return null;
  }

  selectField(field: FormField): void {
    this.selectedField = field;
  }

  deleteSelectedField(): void {
    // Stop if nothing is selected
    if (!this.selectedField) return;

    const field = this.selectedField;

    // Use the recursive finder to get the field's actual parent column
    const location = this.findFieldAndParentColumn(this.droppedRows, field);

    if (!location) {
      console.error('Could not find the parent column for the selected field.');
      this.selectedField = null;
      return;
    }

    if (confirm(`Are you sure you want to delete "${field.label}"?`)) {
      const parentCol = location.parentColumn;

      // Remove the field using filter
      parentCol.fields = parentCol.fields.filter((f) => f.id !== field.id);

      // Clear selection
      this.selectedField = null;
      this.cd.detectChanges();
    }
  }

  // --- Updated Submit Method ---
  submitForm(): void {
    const outputFormDefinition = JSON.parse(JSON.stringify(this.droppedRows));
    alert('downloaded json file successfully');
    // Log output
    console.log('--- Form Submission Successful ---');
    console.log('The generated form structure has been returned as JSON:');
    console.log(outputFormDefinition);
    console.log('---------------------------------');
    // Save to LocalStorage (for auto load on refresh)
    localStorage.setItem('savedFormData', JSON.stringify(outputFormDefinition));
    // --- Save to file ---
    const dataStr = JSON.stringify(outputFormDefinition, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' }); //wraps that text so the browser treats it like a downloadable file.
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    a.download = `formData_${date}.json`;
    a.click();
    window.URL.revokeObjectURL(url); // freeing up memory.
  }
}
