import { NzStandardButton } from '@zak-lib/ui-library/components/standardbutton';
import { NzTableGrid } from '@zak-lib/ui-library/elements/ui/table-grid';
import { NzModuleConfig } from '@zak-lib/ui-library/shared';
export interface NzListView {
  module: NzModuleConfig;
  pageTitle?: string;
  table: NzTableGrid;
  showAddButton?: boolean;
  dynamicHeaderButtons?: NzStandardButton[]; // Buttons to display in front of the add button
  exportToExcel?: boolean;
  exportFileName?: string;
}

export interface NzSearchParameters {
  [key: string]: any;
}
