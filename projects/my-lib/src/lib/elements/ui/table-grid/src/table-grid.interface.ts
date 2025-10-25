import { StandardButton } from '@zak-lib/ui-library/components/standardbutton';
import { FieldConfig, GenericRecord } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';

export interface TableColumn extends FieldConfig {
  type: string;
  isSortable?: boolean;
  enableFilter?: boolean; // For inline filtering
}
export interface TableGrid {
  columns: TableColumn[];
  icon?: string;
  data?: Observable<GenericRecord[]>;
  paginator?: boolean;
  rows?: number;
  showCurrentPageReport?: boolean;
  rowsPerPageOptions?: number[];
  sortableRows?: boolean; // Enable/disable row reordering
  rowSelection?: RowSelectionMode;
  enableStaticActions?: columnStaticActions;
  dynamicActions?: StandardButton[];
  enableColumnSorting?: boolean; // Enable/disable sorting by column header
}

export interface columnStaticActions {
  edit?: boolean;
  delete?: boolean;
  view?: boolean;
}

export type RowSelectionMode = 'single' | 'multiple' | null;

export interface TableSorting {
  page: number;
  rows: {
    id: number;
    sortOrder: number;
  }[];
}
