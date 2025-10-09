import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { RouterOutlet } from '@angular/router';
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
  // Add other field properties as needed
}

interface FormColumn {
  fields: FormField[];
  width?: number; // e.g., for custom column widths (not fully implemented here)
}

interface FormRow {
  id: string; // Unique ID for the row
  columns: FormColumn[];
  tempNumColumns?: number; // Temporary property for new row column selection
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, DragulaWrapperModule],
  providers: [DragulaService],
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
  selectedRowIndex: number | null = null;
  selectedColIndex: number | null = null;

  constructor(private dragulaService: DragulaService, private cd: ChangeDetectorRef) {
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
            target?.classList.contains('form-row-container') ||
            target?.classList.contains('form-column')) ??
          false
        );
      },
    });
  }

  ngOnInit(): void {
    // dropModel for the same bag
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFieldsName)
        .subscribe(({ target, source, item }: any) => {
          // From palette to form builder
          if (source.classList.contains('form-field-palette')) {
            // 🟩 Case 1: Dropping a row
            if (item.type === 'row' && target.classList.contains('form-builder-area')) {
              const newRowId = 'row-' + Date.now();
              this.droppedRows.push({
                id: newRowId,
                columns: [],
                tempNumColumns: 1,
              });
              this.cd.detectChanges(); // Update UI
            } // 🟩 Case 2: Dropping a column
            else if (item.type === 'column' && target.classList.contains('form-row-container')) {
              // Find which row this drop happened in
              const rowIdx = Number(target.getAttribute('data-row'));
              if (!Number.isNaN(rowIdx)) {
                const row = this.droppedRows[rowIdx];

                // Create a new column object
                const newCol = {
                  id: 'col-' + Date.now(),
                  fields: [],
                };

                // Add it to the row
                row.columns.push(newCol);

                // Update UI
                this.cd.detectChanges();
              }
            }
            // 🟦 Case 3: Dropping other fields into a column
            else if (target.classList.contains('form-column')) {
              if (!item.id || !item.id.startsWith('unique-')) {
                item.id = 'unique-' + Date.now() + '-' + Math.random().toFixed(4).replace('0.', '');
              }

              const rowIdx = Number(target.getAttribute('data-row'));
              const colIdx = Number(target.getAttribute('data-col'));
              if (!Number.isNaN(rowIdx) && !Number.isNaN(colIdx)) {
                const col = this.droppedRows[rowIdx].columns[colIdx];
                const exists = col.fields.some((f) => f.id === item.id);
                if (!exists) {
                  col.fields = [...col.fields, item]; // 🔥 immutable push
                  this.cd.detectChanges();
                }
              }
            }
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.bagFieldsName);
    this.dragulaService.destroy(this.bagFormBuilderName);
  }

  addRow(): void {
    const newRowId = 'row-' + Date.now();
    this.droppedRows.push({ id: newRowId, columns: [], tempNumColumns: 1 }); // Default to 1 column initially
  }

  removeRow(rowIndex: number): void {
    this.droppedRows.splice(rowIndex, 1);
    // If the selected field was in this row, deselect it
    if (this.selectedRowIndex === rowIndex) {
      this.selectedField = null;
      this.selectedRowIndex = null;
      this.selectedColIndex = null;
    }
  }

  generateColumns(row: FormRow): void {
    if (row.tempNumColumns && row.tempNumColumns > 0) {
      row.columns = []; // Clear existing columns
      for (let i = 0; i < row.tempNumColumns; i++) {
        row.columns.push({ fields: [] });
      }
      row.tempNumColumns = undefined; // Clear temp selection
    }
  }

  selectField(field: FormField): void {
    this.selectedField = field;
    // Find the indices of the selected field to update `selectedRowIndex` and `selectedColIndex`
    // This is useful for `deleteSelectedField`
    this.droppedRows.forEach((row, rIdx) => {
      row.columns.forEach((col, cIdx) => {
        if (col.fields.includes(field)) {
          this.selectedRowIndex = rIdx;
          this.selectedColIndex = cIdx;
        }
      });
    });
  }

  deleteSelectedField(): void {
    // Stop if nothing is selected or indices are missing
    if (!this.selectedField || this.selectedRowIndex === null || this.selectedColIndex === null)
      return;

    if (confirm(`Are you sure you want to delete "${this.selectedField.label}"?`)) {
      const rowIdx = this.selectedRowIndex;
      const colIdx = this.selectedColIndex;
      const field = this.selectedField;

      // Remove the field
      this.droppedRows[rowIdx].columns[colIdx].fields = this.droppedRows[rowIdx].columns[
        colIdx
      ].fields.filter((f) => f !== field);

      // Clear selection
      this.selectedField = null;
      this.selectedRowIndex = null;
      this.selectedColIndex = null;
    }
  }

  submitForm(): void {
    // Here you would process `this.droppedRows` to generate the final JSON object
    // This example performs a deep copy and removes temporary properties
    const outputFormDefinition = JSON.parse(JSON.stringify(this.droppedRows));

    // Clean up temporary properties if any (like tempNumColumns)
    outputFormDefinition.forEach((row: FormRow) => {
      delete row.tempNumColumns;
      // You might also want to clean up `id` from the palette fields if they were used as template IDs
      // and ensure `id`s are truly unique for the final form.
    });

    console.log('Generated Form JSON:', outputFormDefinition);
    alert('Form definition logged to console!');
    // You can emit this object to a parent component or send it to a backend service
    // Example: this.formSubmitted.emit(outputFormDefinition);
  }
}
