import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  NzConfigurationComponent,
  NzComponentConfiguration,
  NzComponentType,
} from '@zak-lib/ui-library/composed/component-configuration';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { NzFormFieldModule } from '@zak-lib/ui-library/elements/form-fields/form-field/form-field-module';
import { COMPONENTS, DIALOG_MESSAGES } from '@zak-lib/ui-library/shared';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  FormBuilderComponent,
  NzComponentConfig,
  NzComponentTypeEnum,
  NzFormBuilder,
} from './form-builder.interface';
import { NzTypography, NzTypographyComponent } from '@zak-lib/ui-library/elements/typography';
import {
  NzStandardButton,
  NzStandardButtonComponent,
} from '@zak-lib/ui-library/components/standardbutton';
import { NzConfirmDialogService } from '@zak-lib/ui-library/elements/ui/confirm-dialog';

@Component({
  selector: 'nz-form-builder',
  imports: [
    NzFormFieldModule,
    NzConfigurationComponent,
    NzStandardButtonComponent,
    NzTypographyComponent,
    DragDropModule,
  ],
  templateUrl: './form-builder.html',
  styleUrl: './form-builder.scss',
  standalone: true,
})
export class NzFormBuilderComponent {
  @Input() public config!: NzFormBuilder;
  protected readonly title = signal('form-builder');
  public componentConfig!: NzComponentConfiguration | undefined;
  public isDragging = false;
  public saveBtn!: NzStandardButton;
  public migrateBtn!: NzStandardButton;
  public leftHeading: NzTypography = {
    id: 'form-builder-components-heading',
    label: 'Components',
    style: 'h3',
  };

  public middleHeading: NzTypography = {
    id: 'form-builder-droppable-container-heading',
    label: 'Droppable Area',
    style: 'h3',
  };

  public customizeHeading: NzTypography = {
    id: 'form-builder-customizable-container-heading',
    label: 'Component Settings',
    style: 'h3',
  };

  public bagFieldsName!: string;
  public bagFormBuilderName!: string;
  public mainDroppableAreaName = 'main-droppable-area';

  private subs = new Subscription();

  componentTypeEnum = NzComponentTypeEnum;

  availableFields: FormBuilderComponent[] = [];

  droppedRows: FormBuilderComponent[] = [];
  selectedField: FormBuilderComponent | undefined = undefined;

  @Output() save = new EventEmitter<FormBuilderComponent[]>();
  @Output() migrate = new EventEmitter<void>();
  @ViewChild('toolbox', { static: true }) toolbox!: CdkDropList;

  toolBoxContainerId = 'toolbox-components';
  canvasContainerId = 'canvas-container';
  connectedList = [this.canvasContainerId, this.toolBoxContainerId];

  private confirmDialogService = inject(NzConfirmDialogService);
  constructor() {}

  ngOnInit(): void {
    this.saveBtn = {
      onclick: (event: Event) => {
        this.submitForm(event);
      },
      label: 'Submit',
      type: 'button',
    };
    this.migrateBtn = {
      onclick: (event: Event) => {
        this.emitMigrateEvent(event);
      },
      label: 'Migrate',
      type: 'button',
    };
    const instanceId = uuidv4();
    this.bagFieldsName = `BAG_FIELDS_${instanceId}`;
    this.bagFormBuilderName = `BAG_FORM_BUILDER_${instanceId}`;

    COMPONENTS.forEach((component) => {
      this.availableFields.push({
        id: null,
        rowid: '',
        type: component.componentName as NzComponentType,
        label: component.label,
        isNew: true,
        isDeleted: false,
        isFormField: this.isComponent(component.componentName as NzComponentType),
        configuration: {},
        childComponents: [],
      });
    });

    if (this.config.components) {
      this.droppedRows = [...this.mapComponents(this.config.components)];
    }
  }

  private mapComponents(components: NzComponentConfig[]): FormBuilderComponent[] {
    if (components.length === 0) {
      return [];
    }

    const newComps: FormBuilderComponent[] = [];
    components.forEach((comp) => {
      const newComp = {
        ...comp,
        ...{
          rowid: this._rowUUID(),
          childComponents: this.mapComponents(comp.childComponents),
        },
      };
      this.addComponentTOconnectedList(newComp);
      newComps.push(newComp);
    });

    return newComps;
  }

  dropItem(event: CdkDragDrop<FormBuilderComponent[]>) {
    const dragged = event.item.data;

    if (!this.canBeDropped(event)) {
      return;
    }

    // ✅ FROM TOOLBOX → CLONE
    if (event.previousContainer.id === this.toolbox.id) {
      const addedComponent = this.cloneComponent(dragged);
      event.container.data.splice(event.currentIndex, 0, addedComponent);

      // Example: push its droplist id into connectedList
      this.addComponentTOconnectedList(addedComponent);
      return;
    }

    // SAME CONTAINER → SORT
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    // DIFFERENT CONTAINER → MOVE
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }

  private addComponentTOconnectedList(addedComponent: FormBuilderComponent): void {
    if (
      addedComponent.rowid &&
      (addedComponent.type === this.componentTypeEnum.Row ||
        addedComponent.type === this.componentTypeEnum.Column)
    ) {
      this.connectedList.unshift(addedComponent.rowid);
    }
  }

  private canBeDropped(event: CdkDragDrop<FormBuilderComponent[]>): boolean {
    if (
      this.isComponent(event.item.data.type) &&
      event.container.element.nativeElement.dataset['componentType'] !==
        this.componentTypeEnum.Column
    ) {
      return false;
    }

    if (
      event.item.data.type === this.componentTypeEnum.Column &&
      event.container.element.nativeElement.dataset['componentType'] !== this.componentTypeEnum.Row
    ) {
      return false;
    }

    if (
      event.item.data.type === this.componentTypeEnum.Row &&
      event.container.element.nativeElement.dataset['componentType'] !==
        this.componentTypeEnum.Column &&
      event.container.id !== this.canvasContainerId
    ) {
      return false;
    }

    return true;
  }

  private isComponent(type: NzComponentType): boolean {
    if (type === this.componentTypeEnum.Row || type == this.componentTypeEnum.Column) {
      return false;
    }
    return true;
  }

  public connectedListsIds(rowid: string): string[] {
    return this.connectedList.filter((id) => id !== rowid);
  }

  cloneComponent(comp: FormBuilderComponent): FormBuilderComponent {
    return {
      ...comp,
      rowid: this._rowUUID(),
      childComponents: [],
    };
  }

  cdkDragStarted() {
    this.isDragging = true;
  }

  cdkDragEnded() {
    this.isDragging = false;
  }

  private _rowUUID(): string {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectField(component: FormBuilderComponent): void {
    this.selectedField = component;
    this.buildComponentConfiguration(component);
  }

  removeComponent(component: FormBuilderComponent): void {
    if (component.isNew) {
      //TODO: remove from list + remove isNew = true children and set isNew = false to isDeleted = true
    } else {
      component.isDeleted = true;
    }
  }

  private buildComponentConfiguration(field: FormBuilderComponent): void {
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

  saveField(data: Record<string, any>): void {
    this.selectedField!.configuration = data;
    this.selectedField!.label = data['label'];
    this.destroyComponentConfiguration();
  }

  submitForm(event: Event): void {
    this.confirmDialogService.open(event, {
      title: DIALOG_MESSAGES.CONFIRM.TITLE,
      message: DIALOG_MESSAGES.CONFIRM.MESSAGE,
      accept: () => {
        this.save.emit(this.droppedRows);
      },
      cancel: () => {
        return;
      },
    });
  }

  emitMigrateEvent(event: Event): void {
    this.confirmDialogService.open(event, {
      title: DIALOG_MESSAGES.MIGRATE.TITLE,
      message: DIALOG_MESSAGES.MIGRATE.MESSAGE,
      accept: () => {
        this.migrate.emit();
      },
      cancel: () => {
        return;
      },
    });
  }

  get middleFlex(): number {
    return this.selectedField ? 3 : 2;
  }
}
