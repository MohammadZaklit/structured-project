import { Observable } from 'rxjs';

export interface TableColumn {
  field: string;
  header: string;
  type: 'string' | 'number' | 'date' | 'long-string';
  sortable?: boolean;
  filter?: boolean; // For inline filtering
}

export interface TableAction {
  label: string;
  icon?: string;
  callback: (rowData: any) => void;
  styleClass?: string;
  tooltip?: string;
  disabled?: (rowData: any) => boolean; // Dynamic disable based on row data
  visible?: (rowData: any) => boolean; // Dynamic visibility based on row data
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
  dynamicActions?: TableAction[];
  enableColumnSorting?: boolean; // Enable/disable sorting by column header
  showQuickSearch?: boolean;
  showAddButton?: boolean;
  dynamicHeaderButtons?: TableAction[]; // Buttons to display in front of the add button
  exportToExcel?: boolean;
  exportFileName?: string;
}
