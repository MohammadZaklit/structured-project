import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  NzConfigurationComponent,
  NzComponentConfiguration,
  NzComponentType,
} from '@zak-lib/ui-library/composed/component-configuration';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { NzFormFieldModule } from '@zak-lib/ui-library/elements/form-fields/form-field/form-field-module';
import { COMPONENTS, NzUiType, NzUiTypeEnum } from '@zak-lib/ui-library/shared';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NzComponentConfig, NzFormBuilder } from './form-builder.interface';

@Component({
  selector: 'nz-form-builder',
  imports: [NzFormFieldModule, DragulaModule, NzConfigurationComponent], // ✅ Directly import DragulaModule
  providers: [DragulaService], // ✅ Service provider
  templateUrl: './form-builder.html',
  styleUrl: './form-builder.scss',
  standalone: true,
})
export class NzFormBuilderComponent {
  @Input() public config!: NzFormBuilder;
  protected readonly title = signal('form-builder');
  public componentConfig!: NzComponentConfiguration | undefined;

  public bagFieldsName!: string;
  public bagFormBuilderName!: string;

  private subs = new Subscription();

  availableFields: NzComponentConfig[] = [];

  droppedRows: NzComponentConfig[] = [];
  selectedField: NzComponentConfig | undefined = undefined;

  private dragulaService = inject(DragulaService);
  private cd = inject(ChangeDetectorRef);

  @Output() save = new EventEmitter<Record<string, any>>();

  constructor() {}

  ngOnInit(): void {
    const instanceId = uuidv4();
    this.bagFieldsName = `BAG_FIELDS_${instanceId}`;
    this.bagFormBuilderName = `BAG_FORM_BUILDER_${instanceId}`;

    COMPONENTS.forEach((component) => {
      this.availableFields.push({
        id: 0,
        type: component.componentName as NzComponentType,
        label: component.label,
        isNew: true,
        configuration: {},
        childComponents: [],
      });
    });

    if (this.config.components) {
      this.droppedRows = [...this.config.components];
    }

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

    // dropModel for the same bag
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFieldsName)
        .subscribe(({ target, source, item }: any) => {
          // Only handle drops from the palette
          if (source.classList.contains('form-field-palette')) {
            // 1. Dropping a ROW into the main form area
            if (item.type === NzUiTypeEnum.Row && target.classList.contains('form-builder-area')) {
              this.droppedRows.push({
                id: this._rowUUID(),
                type: NzUiTypeEnum.Row,
                isNew: true,
                label: 'Row',
                configuration: {},
                childComponents: [],
              });
              this.cd.detectChanges();
              return; // Stop processing
            }

            // 2. Dropping a COLUMN into a ROW container (main or nested)
            else if (
              item.type === NzUiTypeEnum.Column &&
              target.classList.contains('form-row-container')
            ) {
              // CRITICAL FIX: Find the specific row object (main or nested) by traversing the model
              const row = this.findRowByDomElement(target);

              if (row) {
                // Create a new column object
                const newCol: NzComponentConfig = {
                  id: this._rowUUID(),
                  type: NzUiTypeEnum.Column,
                  isNew: true,
                  label: 'Column',
                  configuration: {},
                  childComponents: [],
                };

                // Add it to the correct row's columns array
                row.childComponents.push(newCol);
                this.cd.detectChanges();
              }
              return; // Stop processing
            }

            // 3. Dropping fields or a ROW for nesting into a COLUMN
            else if (target.classList.contains('form-column')) {
              // Find the correct row ID and column ID from the DOM element
              const rowId = Number(target.getAttribute('data-row-id'));
              const colId = Number(target.getAttribute('data-col-id'));

              if (!rowId || !colId) {
                console.error('Dropped field into column, but row/col IDs are missing.');
                return;
              }

              let fieldToAdd: NzComponentConfig = item;

              if (item.type === NzUiTypeEnum.Row) {
                const nestedRowStructure: NzComponentConfig = {
                  id: this._rowUUID(),
                  type: NzUiTypeEnum.Row,
                  isNew: true,
                  label: 'Row',
                  configuration: {},
                  childComponents: [],
                };

                // Create a field wrapper for the nested row structure
                fieldToAdd = {
                  id: this._rowUUID(),
                  type: NzUiTypeEnum.Row,
                  isNew: true,
                  label: 'Row',
                  configuration: {},
                  childComponents: [nestedRowStructure],
                };
              } else {
                // Standard field - Ensure it has a unique ID
                // Deep copy is handled by copyItem/dragula, but ensure unique ID for fields dropped from palette
                fieldToAdd.id = this._rowUUID();
              }

              // Find the target column in the model
              const targetCol = this.findColumnById(this.droppedRows, rowId, colId);

              if (targetCol) {
                // Dragula handles the DOM movement, we just need to ensure the model is updated
                targetCol.childComponents.push(fieldToAdd);
                this.cd.detectChanges();
              }
            }
          }
        }),
    );
  }

  private _rowUUID(): number {
    return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.bagFieldsName);
    this.dragulaService.destroy(this.bagFormBuilderName);
  }

  // --- Recursive Model Finders ---

  // Recursive search to find a row by its unique ID
  private findRowById(rows: NzComponentConfig[], rowId: number): NzComponentConfig | undefined {
    for (const row of rows) {
      if (row.id === rowId) return row;
      // Check for nested rows inside columns
      for (const col of row.childComponents) {
        for (const field of col.childComponents) {
          if (field.childComponents) {
            const found = this.findRowById(field.childComponents, rowId);
            if (found) return found;
          }
        }
      }
    }
    return undefined;
  }

  // Helper function to find a row (main or nested) object by its DOM element
  private findRowByDomElement(element: Element): NzComponentConfig | undefined {
    const container = element.closest('.form-row-container');
    if (!container) return undefined;

    const rowId = container.getAttribute('data-row-id');
    if (!rowId) return undefined;

    return this.findRowById(this.droppedRows, Number(rowId));
  }

  // Recursive search to find a column by its parent row ID and column ID
  private findColumnById(
    rows: NzComponentConfig[],
    parentRowId: number,
    columnId: number,
  ): NzComponentConfig | undefined {
    for (const row of rows) {
      if (row.id === parentRowId) {
        return row.childComponents.find((col) => col.id === columnId);
      }
      // Check for nested rows
      for (const col of row.childComponents) {
        for (const field of col.childComponents) {
          if (field.childComponents) {
            const found = this.findColumnById(field.childComponents, parentRowId, columnId);
            if (found) return found;
          }
        }
      }
    }
    return undefined;
  }

  // Recursive search to find the parent column of a field
  private findParentColumnOfField(
    rows: NzComponentConfig[],
    fieldToFind: NzComponentConfig,
  ): NzComponentConfig | null {
    for (const row of rows) {
      for (const col of row.childComponents) {
        if (col.childComponents.includes(fieldToFind)) {
          return col;
        }
        // Check for nested rows
        for (const field of col.childComponents) {
          if (field.childComponents) {
            const parent = this.findParentColumnOfField(field.childComponents, fieldToFind);
            if (parent) return parent;
          }
        }
      }
    }
    return null;
  }

  // --- Layout Manipulation Methods ---

  removeRow(rowId: number): void {
    const deleteRecursive = (rows: NzComponentConfig[]): boolean => {
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
        for (const col of row.childComponents) {
          for (const field of col.childComponents) {
            if (field.childComponents) {
              if (deleteRecursive(field.childComponents)) {
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

  removeColumn(parentRowId: number, columnId: number): void {
    if (confirm('Are you sure you want to delete this column and all its contents?')) {
      const row = this.findRowById(this.droppedRows, parentRowId);

      if (row) {
        // Find the column by ID and remove it
        const initialLength = row.childComponents.length;
        row.childComponents = row.childComponents.filter((col) => col.id !== columnId);

        if (row.childComponents.length < initialLength) {
          // Deletion occurred
          // Clear selection if the selected field was in this column
          if (this.selectedField) {
            const parentCol = this.findParentColumnOfField(this.droppedRows, this.selectedField);
            if (!parentCol || parentCol.id === columnId) {
              // If the selected field's parent column was the one deleted
              this.selectedField = undefined;
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
    rows: NzComponentConfig[],
    fieldToFind: NzComponentConfig,
  ): { field: NzComponentConfig; parentColumn: NzComponentConfig } | null {
    for (const row of rows) {
      for (const col of row.childComponents) {
        for (const field of col.childComponents) {
          if (field === fieldToFind) {
            return { field: field, parentColumn: col };
          }
          // Check nested rows
          if (field.childComponents) {
            const result = this.findFieldAndParentColumn(field.childComponents, fieldToFind);
            if (result) return result;
          }
        }
      }
    }
    return null;
  }

  selectField(field: NzComponentConfig): void {
    this.selectedField = field;
    this.buildComponentConfiguration(field);
  }

  private buildComponentConfiguration(field: NzComponentConfig): void {
    this.componentConfig = {
      type: field.type as NzFieldType,
      configuration: field.configuration,
    };
  }

  private destroyComponentConfiguration(): void {
    this.componentConfig = undefined;
  }

  public closeSettings(): void {
    this.destroyComponentConfiguration();
  }

  deleteSelectedField(): void {
    // Stop if nothing is selected
    if (!this.selectedField) return;

    const field = { ...this.selectedField };

    // Use the recursive finder to get the field's actual parent column
    const location = this.findFieldAndParentColumn(this.droppedRows, field);

    if (!location) {
      console.error('Could not find the parent column for the selected field.');
      this.selectedField = undefined;
      return;
    }

    if (confirm(`Are you sure you want to delete "${field.label}"?`)) {
      const parentCol = location.parentColumn;

      // Remove the field using filter
      parentCol.childComponents = parentCol.childComponents.filter((f) => f.id !== field.id);

      // Clear selection
      this.selectedField = undefined;
      this.cd.detectChanges();
    }
  }

  saveField(data: NzComponentConfiguration): void {
    console.warn('config: ', data);
    this.selectedField!.configuration = data;
    this.destroyComponentConfiguration();
  }

  submitForm(): void {
    const outputFormData = JSON.parse(JSON.stringify(this.droppedRows));
    this.save.emit(outputFormData);
  }
}
