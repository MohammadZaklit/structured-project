import { NzStandardButton } from '@zak-lib/ui-library/components/standardbutton';
import { NzModuleFieldConfig, NzGenericRecord } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';

export interface NzTableColumn extends NzModuleFieldConfig {
  type: string;
  isSortable?: boolean;
  enableFilter?: boolean; // For inline filtering,
  customDisplay?: (row: NzGenericRecord) => string;
}
export interface NzTableGrid {
  title?: string;
  showQuickSearch?: boolean;
  columns: NzTableColumn[];
  icon?: string;
  data?: Observable<NzGenericRecord[]>;
  paginator?: boolean;
  rows?: number;
  showCurrentPageReport?: boolean;
  rowsPerPageOptions?: number[];
  sortableRows?: boolean; // Enable/disable row reordering
  rowSelection?: NzRowSelectionMode;
  enableStaticActions?: NzColumnStaticActions;
  dynamicActions?: NzStandardButton[];
  enableColumnSorting?: boolean; // Enable/disable sorting by column header
}

export interface NzColumnStaticActions {
  edit?: boolean;
  delete?: boolean;
  view?: boolean;
}

export type NzRowSelectionMode = 'single' | 'multiple' | null;

export interface NzTableSorting {
  page: number;
  rows: {
    id: number;
    sortOrder: number;
  }[];
}
