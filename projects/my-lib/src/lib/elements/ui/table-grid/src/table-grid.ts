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
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; // For ngModel
import { TableGrid } from './table-grid.interface';

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
  @Output() onRowReorder = new EventEmitter<any>();
  @Output() onColumnSort = new EventEmitter<any>();

  tableData: WritableSignal<any[]> = signal([]);
  selectedRows: any[] = [];

  private dataSubscription: Subscription | undefined;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config()) {
      // Unsubscribe from previous data observable if it exists
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
      // Subscribe to the new data observable
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
    if (this.config()?.rowSelection !== 'none') colspan++;
    if (this.config()?.sortableRows) colspan++;
    if (this.config()?.enableStaticActions || (this.config()?.dynamicActions || [])?.length > 0)
      colspan++;
    return colspan;
  }

  public shouldApplyFilter(): boolean {
    return this.config()?.columns.some((c) => c.filter) || false;
  }
}
