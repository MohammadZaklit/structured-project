import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { NzTableColumn } from '@zak-lib/ui-library/elements/ui/table-grid';
import { NzListView, NzListViewComponent } from '@zak-lib/ui-library/layouts/list-view';
import { NzFieldConfig, NzGenericRecord, NzModuleConfig } from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '../../../../shared/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';

@Component({
  selector: 'app-admin-page-listing',
  imports: [CommonModule, NzListViewComponent],
  templateUrl: './admin-page-listing.html',
  styleUrl: './admin-page-listing.scss',
  standalone: true,
})
export class AdminPageListing implements OnInit {
  ListViewConfig = signal<NzListView | undefined>(undefined);
  private moduleSettings = inject(ModuleSettingsService);
  @Output() public addRow = new EventEmitter<void>();
  @Output() public editRow = new EventEmitter<any>();
  @Output() public deleteRow = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.ListViewConfig.set({
      module: this.moduleSettings.module() as NzModuleConfig,
      table: {
        title: this.moduleSettings.module()?.label,
        showQuickSearch: true,
        columns: this.mapFieldsToColumns(this.moduleSettings.fields()),
        paginator: true,
        rows: 10,
        showCurrentPageReport: true,
        rowsPerPageOptions: [10, 25, 50],
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

      showAddButton: true,
      dynamicHeaderButtons: [],
      exportToExcel: true,
      exportFileName: '',
    });
  }

  private mapFieldsToColumns(fields: NzFieldConfig[]): NzTableColumn[] {
    return (
      fields.map((field) => {
        return Object.assign(field, {
          type:
            COMPONENTS.find((component) => component.id === field['componentId'])?.componentName ??
            'InputText',
          isSortable: true,
          enableFilter: true,
        });
      }) || []
    );
  }

  public editRowCallback(data: NzGenericRecord): void {
    this.editRow.emit(data);
  }
}
