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
import { NzComponentConfig, NzComponentTypeEnum, NzFormBuilder } from './form-builder.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'nz-form-builder',
  imports: [NzFormFieldModule, DragulaModule, NzConfigurationComponent, ButtonModule], // ✅ Directly import DragulaModule
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
  public mainDroppableAreaName = 'main-droppable-area';

  private subs = new Subscription();

  componentTypeEnum = NzComponentTypeEnum;

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
      // this.droppedRows = [...this.config.components];
    }

    // create one bag only
    this.dragulaService.createGroup(this.bagFieldsName, {
      moves: (_el?: Element, _container?: Element, _handle?: Element) => {
        return _el?.classList.contains('is-draggable') ?? false;
      },
      copy: (_el?: Element, source?: Element) =>
        source?.classList.contains('form-field-palette') ?? false,
      copyItem: (item: any) => JSON.parse(JSON.stringify(item)),
      accepts: (el?: Element, target?: Element, _source?: Element) => {
        const draggedComponentType = el?.getAttribute('data-component-type');
        const res =
          (target?.classList.contains('is-droppable') &&
            ((draggedComponentType === this.componentTypeEnum.Row &&
              (target?.classList.contains(this.mainDroppableAreaName) ||
                target?.getAttribute('data-component-type') === this.componentTypeEnum.Column)) ||
              (draggedComponentType === this.componentTypeEnum.Column &&
                target?.getAttribute('data-component-type') === this.componentTypeEnum.Row))) ||
          (draggedComponentType !== this.componentTypeEnum.Row &&
            draggedComponentType !== this.componentTypeEnum.Column &&
            target?.getAttribute('data-component-type') === this.componentTypeEnum.Column) ||
          false;

        return res;
      },
    });

    // dropModel for the same bag
    this.subs.add(
      this.dragulaService
        .dropModel(this.bagFieldsName)
        .subscribe(({ target, _source, item }: any) => {
          if (target.classList.contains(this.mainDroppableAreaName)) {
            this.droppedRows.push({ ...item, ...{ id: this._rowUUID() } });
            this.cd.detectChanges();
          } else {
            this.handleDrop(target, item);
          }
        }),
    );
  }

  private handleDrop(target: HTMLElement, draggedItem: NzComponentConfig) {
    const targetComponentId = Number(target.getAttribute('data-component-id'));

    const targetContainer = this.findComponentById(this.droppedRows, targetComponentId);

    if (!targetContainer || !draggedItem) return;

    if (draggedItem.isNew) {
      this.cloneFromPalette(targetContainer, draggedItem);
    } else {
      this.moveBetweenContainers(targetContainer, draggedItem);
    }

    this.cd.detectChanges();
  }

  private cloneFromPalette(target: NzComponentConfig, item: NzComponentConfig) {
    target.childComponents.push({
      ...item,
      id: this._rowUUID(),
      isNew: false,
      childComponents: [],
    });
  }

  private moveBetweenContainers(target: NzComponentConfig, item: NzComponentConfig) {
    const parent = this.findParentComponent(this.droppedRows, item.id);

    if (!parent || parent === target) return;

    const removed = this.removeComponentById(this.droppedRows, item.id);

    if (!removed) return;

    parent.childComponents = parent.childComponents.filter((c) => c.id !== item.id);

    target.childComponents.push(item);
  }

  private findComponentById(components: NzComponentConfig[], id: number): NzComponentConfig | null {
    for (const component of components) {
      if (component.id === id) return component;

      const found = this.findComponentById(component.childComponents, id);

      if (found) return found;
    }
    return null;
  }

  private findParentComponent(
    components: NzComponentConfig[],
    childId: number,
  ): NzComponentConfig | null {
    for (const component of components) {
      if (component.childComponents.some((c) => c.id === childId)) {
        return component;
      }

      const found = this.findParentComponent(component.childComponents, childId);

      if (found) return found;
    }
    return null;
  }

  private removeComponentById(components: NzComponentConfig[], id: number): boolean {
    for (const component of components) {
      const index = component.childComponents.findIndex((c) => c.id === id);

      if (index !== -1) {
        component.childComponents.splice(index, 1);
        return true;
      }

      if (this.removeComponentById(component.childComponents, id)) {
        return true;
      }
    }
    return false;
  }

  private _rowUUID(): number {
    return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.bagFieldsName);
    this.dragulaService.destroy(this.bagFormBuilderName);
  }

  /**
   * @deprecated
   * @returns
   */
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

  /**
   * @deprecated
   * @returns
   */
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

  /**
   * @deprecated
   * @returns
   */
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

  /**
   * @deprecated
   * @returns
   */
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

  /**
   * @deprecated
   * @returns
   */
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

  saveField(data: Record<string, any>): void {
    this.selectedField!.configuration = data;
    this.selectedField!.label = data['label'];
    this.destroyComponentConfiguration();
  }

  submitForm(): void {
    const outputFormData = JSON.parse(JSON.stringify(this.droppedRows));
    this.save.emit(outputFormData);
  }
}
