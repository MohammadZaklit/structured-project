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
import { COMPONENTS } from '@zak-lib/ui-library/shared';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NzComponentConfig, NzComponentTypeEnum, NzFormBuilder } from './form-builder.interface';
import { ButtonModule } from 'primeng/button';
import { NzTypography, NzTypographyComponent } from '@zak-lib/ui-library/elements/typography';

@Component({
  selector: 'nz-form-builder',
  imports: [
    NzFormFieldModule,
    NzConfigurationComponent,
    ButtonModule,
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

  connectedDropLists = ['toolbox'];
  private subs = new Subscription();

  componentTypeEnum = NzComponentTypeEnum;

  availableFields: NzComponentConfig[] = [];

  droppedRows: NzComponentConfig[] = [];
  selectedField: NzComponentConfig | undefined = undefined;
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
  }

  public dropItem(event: CdkDragDrop<NzComponentConfig[]>, items?: NzComponentConfig): void {
    console.warn('event: ', event);
    //  if (event.previousIndex === event.currentIndex) return;

    // moveItemInArray(
    //   this.rows,
    //   event.previousIndex,
    //   event.currentIndex
    // );
    //     transferArrayItem(
    //   sourceArray,
    //   targetArray,
    //   fromIndex,
    //   toIndex
    // );
  }

  private handleDrop(target: HTMLElement, draggedItem: NzComponentConfig) {
    const targetComponentId = Number(target.getAttribute('data-component-id'));

    const targetContainer = this.findComponentById(this.droppedRows, targetComponentId);

    if (!targetContainer || !draggedItem) return;

    if (draggedItem.id === 0) {
      this.cloneFromPalette(targetContainer, draggedItem);
    } else {
      this.moveBetweenContainers(targetContainer, draggedItem);
    }

    this.cd.detectChanges();
  }

  private cloneFromPalette(targetComponent: NzComponentConfig, item: NzComponentConfig) {
    targetComponent.childComponents.push({
      ...item,
      id: this._rowUUID(),
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
  }

  selectField(e: Event, component: NzComponentConfig): void {
    e.stopPropagation();
    this.selectedField = component;
    this.buildComponentConfiguration(component);
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

  saveField(data: Record<string, any>): void {
    this.selectedField!.configuration = data;
    this.selectedField!.label = data['label'];
    this.destroyComponentConfiguration();
  }

  submitForm(): void {
    const outputFormData = JSON.parse(JSON.stringify(this.droppedRows));
    this.save.emit(outputFormData);
  }

  get middleFlex(): number {
    return this.selectedField ? 3 : 2;
  }
}
