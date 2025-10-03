import { Component, signal } from '@angular/core';
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
  imports: [RouterOutlet, FormsModule, CommonModule, DragulaWrapperModule],
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

  constructor(private dragulaService: DragulaService) {
    const instanceId = uuidv4();
    this.bagFieldsName = `BAG_FIELDS_${instanceId}`;
    this.bagFormBuilderName = `BAG_FORM_BUILDER_${instanceId}`;

    // Initialize Dragula bags
    // BAG_FIELDS: For dragging fields from the palette
    // BAG_FORM_BUILDER: For dragging fields within and between columns in the middle
    dragulaService.createGroup(this.bagFieldsName, {
      copy: (_el: HTMLElement, source: HTMLElement) => {
        return source.classList.contains('form-field-palette');
      },
      copySortSource: true, // Allow sorting in the source if needed
      accepts: (
        _el: HTMLElement,
        target: HTMLElement,
        source: HTMLElement,
        _sibling: HTMLElement
      ) => {
        // Only accept drops from BAG_FIELDS into BAG_FORM_BUILDER
        return (
          target.classList.contains('form-column') &&
          source.classList.contains('form-field-palette')
        );
      },
    });

    dragulaService.createGroup(this.bagFormBuilderName, {
      // Allow moving fields anywhere within the form builder columns
      // copy: false (default), so items are moved, not copied
      accepts: (
        _el: HTMLElement,
        target: HTMLElement,
        _source: HTMLElement,
        _sibling: HTMLElement | null
      ) => {
        return target.classList.contains('form-column');
      },
    });
  }

  ngOnInit(): void {
    // Subscribe to drop events for BAG_FIELDS
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFieldsName)
        .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
          // When a field is dropped from the palette into a column
          if (
            source.classList.contains('form-field-palette') &&
            target.classList.contains('form-column')
          ) {
            // 'item' here is a deep copy of the original field from availableFields
            // Assign a unique ID if it doesn't have one (important for tracking)
            if (!item.instance.id.startsWith('unique-')) {
              item.instance.id =
                'unique-' + Date.now() + '-' + Math.random().toFixed(4).replace('0.', '');
            }
            console.log('Field dropped from palette:', item.instance);
            // The item is already added to targetModel by dragula,
            // but we might want to do further processing or validation here.
          }
        })
    );

    // Subscribe to drop events for BAG_FORM_BUILDER
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFormBuilderName)
        .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
          // This handles reordering within a column or moving between columns
          // 'item' is the actual field object being moved
          console.log('Field moved within builder:', item.instance);
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

  removeField(rowIndex: number, colIndex: number, fieldToRemove: FormField): void {
    if (confirm(`Are you sure you want to remove "${fieldToRemove.label}"?`)) {
      const col = this.droppedRows[rowIndex].columns[colIndex];
      col.fields = col.fields.filter((f) => f !== fieldToRemove);

      if (this.selectedField === fieldToRemove) {
        this.selectedField = null;
        this.selectedRowIndex = null;
        this.selectedColIndex = null;
      }
    }
  }

  deleteSelectedField(): void {
    if (this.selectedField && this.selectedRowIndex !== null && this.selectedColIndex !== null) {
      if (confirm(`Are you sure you want to delete "${this.selectedField.label}"?`)) {
        this.removeField(this.selectedRowIndex, this.selectedColIndex, this.selectedField);
      }
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
