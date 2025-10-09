import { StandardButton } from '@zak-lib/ui-library/components/standardbutton';
import { FieldConfig } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';

export interface TableColumn extends FieldConfig {
  sortable?: boolean;
  filter?: boolean; // For inline filtering
}
export interface TableGrid {
  columns: TableColumn[];
  data?: Observable<any[]>;
  paginator?: boolean;
  rows?: number;
  showCurrentPageReport?: boolean;
  rowsPerPageOptions?: number[];
  sortableRows?: boolean; // Enable/disable row reordering
  rowSelection?: 'single' | 'multiple' | 'none'; // 'none' to disable selection
  enableStaticActions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
  dynamicActions?: StandardButton[];
  enableColumnSorting?: boolean; // Enable/disable sorting by column header
}
