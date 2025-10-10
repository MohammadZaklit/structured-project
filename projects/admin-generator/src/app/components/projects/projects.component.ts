import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
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
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    ListViewComponent,
    FormWizardComponent,
  ],
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

  public dbFields: FormFieldConfig[] = [
    { key: 'name', label: 'Full Name', type: 'InputText', step: 0, required: true },
    { key: 'dob', label: 'Date of Birth', type: 'DatePicker', step: 0 },
    {
      key: 'gender',
      label: 'Gender',
      type: 'RadioButton',
      step: 1,
      options: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
      ],
    },
  ];

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
  }

  private mapFieldsToColumns(fields: GenericRecord[]): TableColumn[] {
    return (
      fields.map((field) => {
        return {
          name: field['field_name'],
          label: field['field_label'],
          type: field['type'],
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
