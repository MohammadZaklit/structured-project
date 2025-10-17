import { StandardButton } from '@zak-lib/ui-library/components/standardbutton';
import { TableGrid } from '@zak-lib/ui-library/elements/ui/table-grid';
import { ModuleConfig } from '@zak-lib/ui-library/shared';
export interface ListView {
  module: ModuleConfig;
  pageTitle?: string;
  table: TableGrid;
  showQuickSearch?: boolean;
  showAddButton?: boolean;
  dynamicHeaderButtons?: StandardButton[]; // Buttons to display in front of the add button
  exportToExcel?: boolean;
  exportFileName?: string;
}
