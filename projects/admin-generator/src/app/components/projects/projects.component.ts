import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericRecord } from '@zak-lib/ui-library/shared';
import { of } from 'rxjs';
import { TableColumn } from '@zak-lib/ui-library/elements/ui/table-grid';

import { ListView, ListViewComponent } from '@zak-lib/ui-library/layouts/list-view';
import { SettingsService } from '../../services/settings.service';
import {
  FormFieldConfig,
  FormWizardComponent,
  StepperConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ListViewComponent, FormWizardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  private moduleName = 'projects';
  private moduleLabel = 'projects';
  private moduleID = 1;
  ListViewConfig = signal<ListView | undefined>(undefined);
  private settingsService = inject(SettingsService);

  public stepConfig: StepperConfig = {
    steps: [
      { label: 'Personal Info', icon: 'pi pi-user' },
      { label: 'Preferences', icon: 'pi pi-cog' },
    ],
  };

  public dbFields: FormFieldConfig[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getModuleConfig();
  }

  private async getModuleConfig(): Promise<void> {
    const fields = await this.settingsService.getModuleFields(this.moduleID);

    this.ListViewConfig.set({
      pageTitle: this.moduleLabel,
      moduleName: this.moduleName,
      table: {
        columns: this.mapFieldsToColumns(fields),
        data: of([]),
        paginator: true,
        rows: 5,
        showCurrentPageReport: true,
        rowsPerPageOptions: [5, 10, 20],
        sortableRows: true,
        rowSelection: 'multiple',
        enableStaticActions: {
          edit: true,
          delete: true,
          view: true,
        },
        dynamicActions: [],
        enableColumnSorting: true,
      },
      showQuickSearch: true,
      showAddButton: true,
      dynamicHeaderButtons: [],
      exportToExcel: true,
      exportFileName: '',
    });

    this.dbFields = fields.map((field) => {
      const newField = {
        key: field['name'],
        label: field['label'],
        type:
          components.find((component) => component.id === field['componentId'])?.componentName ??
          'InputText',
        step: 1,
      };
      return newField;
    });
  }

  private mapFieldsToColumns(fields: GenericRecord[]): TableColumn[] {
    return (
      fields.map((field) => {
        return {
          name: field['name'],
          label: field['label'],
          type:
            components.find((component) => component.id === field['componentId'])?.componentName ??
            'InputText',
          sortable: true,
          filter: true,
        };
      }) || []
    );
  }

  public onFormSubmit(data: any): void {
    console.warn('data; ', data);
  }
}

export const components = [
  {
    id: 1,
    componentName: 'AutoComplete',
    label: 'AutoComplete',
    dbType: 'int',
  },
  {
    id: 2,
    componentName: 'CascadeSelect',
    label: 'CascadeSelect',
    dbType: 'int',
  },
  {
    id: 3,
    componentName: 'ColorPicker',
    label: 'ColorPicker',
    dbType: 'text',
  },
  {
    id: 4,
    componentName: 'DatePicker',
    label: 'DatePicker',
    dbType: 'date',
  },
  {
    id: 5,
    componentName: 'FloatLabel',
    label: 'FloatLabel',
    dbType: 'text',
  },
  { id: 6, componentName: 'IconField', label: 'IconField', dbType: 'text' },
  {
    id: 7,
    componentName: 'InputGroup',
    label: 'InputGroup',
    dbType: 'text',
  },
  { id: 8, componentName: 'InputMask', label: 'InputMask', dbType: 'text' },
  {
    id: 9,
    componentName: 'InputNumber',
    label: 'InputNumber',
    dbType: 'numeric',
  },
  {
    id: 10,
    componentName: 'InputText',
    label: 'InputText',
    dbType: 'text',
  },
  {
    id: 11,
    componentName: 'KeyFilter',
    label: 'KeyFilter',
    dbType: 'text',
  },
  { id: 12, componentName: 'Knob', label: 'Knob', dbType: 'numeric' },
  {
    id: 13,
    componentName: 'Listbox',
    label: 'Listbox',
    dbType: 'many_to_many',
  },
  {
    id: 14,
    componentName: 'MultiSelect',
    label: 'MultiSelect',
    dbType: 'many_to_many',
  },
  {
    id: 15,
    componentName: 'RadioButtonDB',
    label: 'Radio Button From DB',
    dbType: 'foreign_key',
  },
  {
    id: 16,
    componentName: 'RadioButtonOptions',
    label: 'Radio Button Static Options',
    dbType: 'text',
  },
  {
    id: 17,
    componentName: 'SelectButton',
    label: 'SelectButton',
    dbType: 'text',
  },
  { id: 18, componentName: 'Slider', label: 'Slider', dbType: 'numeric' },
  {
    id: 19,
    componentName: 'Textarea',
    label: 'Textarea',
    dbType: 'longtext',
  },
  {
    id: 20,
    componentName: 'ToggleButton',
    label: 'ToggleButton',
    dbType: 'bool',
  },
  {
    id: 21,
    componentName: 'ToggleSwitch',
    label: 'ToggleSwitch',
    dbType: 'bool',
  },
  {
    id: 22,
    componentName: 'TreeSelectDB',
    label: 'TreeSelect From DB',
    dbType: 'foreign_key',
  },
  {
    id: 23,
    componentName: 'TreeSelectOptions',
    label: 'TreeSelect Static Options',
    dbType: 'text',
  },
  { id: 24, componentName: 'Button', label: 'Button', dbType: 'ui' },
  {
    id: 25,
    componentName: 'SplitButton',
    label: 'SplitButton',
    dbType: 'ui',
  },
  {
    id: 26,
    componentName: 'PickListDB',
    label: 'PickList From DB',
    dbType: 'many_to_many',
  },
  {
    id: 27,
    componentName: 'PickListOptions',
    label: 'PickList Static Data',
    dbType: 'json',
  },
  {
    id: 28,
    componentName: 'FileUploadDragDrop',
    label: 'FileUpload (Drag & Drop)',
    dbType: 'many_to_many',
  },
  {
    id: 29,
    componentName: 'FileUploadBrowse',
    label: 'FileUpload (Browse)',
    dbType: 'many_to_many',
  },
  { id: 30, componentName: 'row', label: 'Row', dbType: 'ui' },
  { id: 31, componentName: 'column', label: 'Column', dbType: 'ui' },
  {
    id: 32,
    componentName: 'DateTimePicker',
    label: 'DateTimePicker',
    dbType: 'datetime',
  },
  { id: 33, componentName: 'Rating', label: 'Rating', dbType: 'numeric' },
  { id: 34, componentName: 'SpeedDial', label: 'SpeedDial', dbType: 'ui' },
];
