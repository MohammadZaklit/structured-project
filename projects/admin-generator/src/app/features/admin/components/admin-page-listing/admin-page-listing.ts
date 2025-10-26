import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { TableColumn } from '@zak-lib/ui-library/elements/ui/table-grid';
import { ListView, ListViewComponent } from '@zak-lib/ui-library/layouts/list-view';
import { FieldConfig, GenericRecord, ModuleConfig } from '@zak-lib/ui-library/shared';
import { components } from 'projects/admin-generator/src/app/shared/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';

@Component({
  selector: 'app-admin-page-listing',
  imports: [CommonModule, ListViewComponent],
  templateUrl: './admin-page-listing.html',
  styleUrl: './admin-page-listing.scss',
  standalone: true,
})
export class AdminPageListing implements OnInit {
  ListViewConfig = signal<ListView | undefined>(undefined);
  private moduleSettings = inject(ModuleSettingsService);
  @Output() public addRow = new EventEmitter<void>();
  @Output() public editRow = new EventEmitter<any>();
  @Output() public deleteRow = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.ListViewConfig.set({
      pageTitle: this.moduleSettings.module()?.label,
      module: this.moduleSettings.module() as ModuleConfig,
      table: {
        columns: this.mapFieldsToColumns(this.moduleSettings.fields()),
        paginator: true,
        rows: 50,
        showCurrentPageReport: true,
        rowsPerPageOptions: [5, 10, 20],
        sortableRows: true,
        rowSelection: 'multiple',
        enableStaticActions: {
          edit: true,
          delete: true,
          view: false,
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

  private mapFieldsToColumns(fields: FieldConfig[]): TableColumn[] {
    return (
      fields.map((field) => {
        return Object.assign(field, {
          type:
            components.find((component) => component.id === field['componentId'])?.componentName ??
            'InputText',
          isSortable: true,
          enableFilter: true,
        });
      }) || []
    );
  }

  public editRowCallback(data: GenericRecord): void {
    this.editRow.emit(data);
  }
}
