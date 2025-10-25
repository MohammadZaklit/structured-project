import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { TableModule, TablePageEvent, TableRowReorderEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; // For ngModel
import {
  columnStaticActions,
  RowSelectionMode,
  TableGrid,
  TableSorting,
} from './table-grid.interface';
import { StandardButton } from '@zak-lib/ui-library/components/standardbutton';

@Component({
  selector: 'lib-table-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    PaginatorModule,
    RippleModule, // For button effects
  ],
  providers: [DatePipe], // Provide DatePipe
  templateUrl: './table-grid.html',
  styleUrl: './table-grid.scss',
})
export class TableGridComponent implements OnChanges {
  @Input() config: WritableSignal<TableGrid | undefined> = signal(undefined);

  @Output() onEdit = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onRowReorder = new EventEmitter<TableSorting>();
  @Output() onColumnSort = new EventEmitter<any>();

  tableData: WritableSignal<any[]> = signal([]);
  selectedRows: any[] = [];

  private dataSubscription: Subscription | undefined;
  private currentPage = 1;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config()) {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
      this.dataSubscription = this.config()?.data?.subscribe((data) => {
        this.tableData.set(data);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // PrimeNG lazy load event for filtering/sorting if backend processing is needed
  // For client-side operations (like global filter), PrimeNG handles it directly.
  onLazyLoad(event: any) {
    // This is primarily for server-side pagination, sorting, filtering.
    // For this client-side example, the global filter handles it.
    // If you implement server-side, you'd emit an event here to fetch data.
    // console.log("Lazy load event:", event);
  }

  getColspan(): number {
    let colspan = this.config()?.columns.length || 0;
    if (this.selectionMode !== null) colspan++;
    if (this.config()?.sortableRows) colspan++;
    if (this.enableStaticActions || this.hasDynamicActions) colspan++;
    return colspan;
  }

  public shouldApplyFilter(): boolean {
    return this.config()?.columns.some((c) => c.enableFilter) || false;
  }

  public get enableStaticActions(): boolean {
    const actions = this.config()?.enableStaticActions;
    return !!(actions && (actions.edit || actions.delete || actions.view));
  }

  public staticActions(): columnStaticActions {
    return (
      this.config()?.enableStaticActions || {
        edit: false,
        delete: false,
        view: false,
      }
    );
  }

  public pageChangeCallback(page: TablePageEvent): void {
    console.warn('page: ', page);
  }

  public rowsReOrderCallback(data: TableRowReorderEvent): void {
    const tableData = this.tableData().map((row, index) => {
      return {
        id: (row?.id as number) || index + 1,
        sortOrder: index,
      };
    });
    this.onRowReorder.emit({
      page: this.currentPage,
      rows: tableData,
    });
  }

  public get hasDynamicActions(): boolean {
    return (this.config()?.dynamicActions || [])?.length > 0;
  }

  public dynamicActions(): StandardButton[] {
    return this.config()?.dynamicActions || [];
  }

  public get enableColumnSorting(): boolean {
    return this.config()?.enableColumnSorting || false;
  }

  public get globalFilterFields(): string[] {
    return this.config()?.columns.map((c) => c.name) ?? [];
  }

  public get selectionMode(): RowSelectionMode {
    return this.config()?.rowSelection ?? null;
  }

  public get sortableRows(): boolean {
    return this.config()?.sortableRows || false;
  }
}
