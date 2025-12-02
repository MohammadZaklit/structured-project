import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  TableGrid,
  TableGridComponent,
  TableSorting,
} from '@zak-lib/ui-library/elements/ui/table-grid';
import { ListView, SearchParameters } from './list-view.interface';
import { GenericRecord, HttpService } from '@zak-lib/ui-library/shared';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import {
  ConfirmPopupComponent,
  ConfirmPopupConfig,
} from '@zak-lib/ui-library/elements/ui/confirm-popup';
@Component({
  selector: 'lib-list-view',
  standalone: true,
  imports: [TableGridComponent, ButtonModule, TooltipModule, FormsModule, ConfirmPopupComponent],
  templateUrl: './list-view.html',
  styleUrl: './list-view.css',
})
export class ListViewComponent implements OnInit, OnDestroy {
  @Input() public config: WritableSignal<ListView | undefined> = signal(undefined);
  public tableConfig: WritableSignal<TableGrid | undefined> = signal(undefined);
  tableData: WritableSignal<any[]> = signal([]);
  @Output() onAdvancedSearch = new EventEmitter<void>();
  @Output() addBtnClick = new EventEmitter<void>();
  @Output() editBtnClick = new EventEmitter<any>();
  @Output() deleteBtnClick = new EventEmitter<any>();
  private isEditMode = false;
  private loading = false;
  private displayDialog = false;

  public quickSearchValue: string = '';
  private httpService = inject(HttpService);
  private searchParameters$ = new BehaviorSubject<SearchParameters>({});
  private reload$ = new Subject<void>();

  public DeleteConfirmPopupConfig!: ConfirmPopupConfig;

  constructor() {}

  ngOnInit(): void {
    this.config()!.table.data = combineLatest([
      this.searchParameters$.pipe(debounceTime(100), distinctUntilChanged()),
      this.reload$.pipe(startWith(null)),
    ]).pipe(switchMap(([terms, _isTriggered]) => this.httpService.getAll(this.moduleName, terms)));

    this.tableConfig.set(this.config()?.table);

    this.DeleteConfirmPopupConfig = {
      title: 'Delete Confirmation',
      message: 'Are you sure you want to delete this row?',
    };
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.tableData());
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.config()?.exportFileName || 'table_data');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import('file-saver').then(FileSaver => {
    //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //   let EXCEL_EXTENSION = '.xlsx';
    //   const data: Blob = new Blob([buffer], {
    //     type: EXCEL_TYPE
    //   });
    //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // });
  }

  private get moduleName(): string {
    return this.config()!.module.name;
  }

  async loadData(): Promise<void> {
    try {
      const response = await firstValueFrom(this.httpService.getAll(this.moduleName));
      this.reload$.next();
    } catch (error) {
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Failed to load ' + this.moduleName + ' data',
      // });
    } finally {
      //this.loading = false;
    }
  }

  hideDialog(): void {
    // this.displayDialog = false;
  }

  editRowCallback(rowData: GenericRecord) {
    this.editBtnClick.emit(rowData);
  }

  viewRowCallback(rowData: any) {
    console.log('View clicked for:', rowData);
    // Implement your view logic here
  }

  public deleteRowCallback(event: { event: Event; rowData: GenericRecord }): void {
    this.DeleteConfirmPopupConfig.accept = () => {
      this.deleteRow(event.rowData);
    };
    this.DeleteConfirmPopupConfig.cancel = () => {
      // do nothing
      return;
    };
    this.DeleteConfirmPopupConfig.confirm?.(event.event);
  }

  private async deleteRow(rowData: GenericRecord): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.delete(this.moduleName, rowData.id || 0),
    );
    if (response) {
      this.loadData();
      this.deleteBtnClick.emit(rowData);
    }
  }

  public async reorderRowCallback(data: TableSorting) {
    await firstValueFrom(this.httpService.post('sort/' + this.moduleName, data));
  }

  handleAdvancedSearch() {
    console.log('Advanced Search button clicked. Open advanced search dialog/component.');
    // Emit an event or open a modal for advanced search
  }

  sortcolumnRowCallback(event: any) {
    console.log('Column sorted:', event);
    // event.field: The field that is sorted
    // event.order: 1 for asc, -1 for desc
    // event.data: The current data in the table (already sorted by PrimeNG for client-side)
    // If you have server-side sorting, you would make an API call here.
  }

  handleAddItem() {
    console.log('Add New Item button clicked.');
    // Open a form for adding a new item
  }

  updateData() {
    console.log('Update data.');
    // Simulate data update
    //const newProduct: GenericRecord = {
    //  id: this.data.length + 1,
    //  code: 'xyz' + (this.data.length + 1),
    //   name: `New Product ${this.data.length + 1}`,
    //  description: `Description of new product ${this.data.length + 1}`,
    //  price: Math.floor(Math.random() * 200) + 50,
    //  quantity: Math.floor(Math.random() * 50),
    //  inventoryStatus: Math.random() > 0.5 ? 'INSTOCK' : 'LOWSTOCK',
    //  category: 'Gadgets',
    //  rating: Math.floor(Math.random() * 5) + 1,
    //  dateAdded: new Date(),
    //   longTextDescription: `This is a brand new item added at ${new Date().toLocaleTimeString()}. It has some exciting features you will love.`,
    // };
    // this.data.push(newProduct);
    // this.tableData$ = of([...this.data]).pipe(delay(100)); // Create a new observable
    // this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ })); // Update the signal to trigger ngOnChanges
  }

  addNewItem() {
    this.handleAddItem();
  }

  public showAddDialog(): void {
    this.isEditMode = false;
    this.displayDialog = true;
  }

  public showEditDialog(row: GenericRecord): void {
    this.isEditMode = true;
    this.displayDialog = true;
  }

  // public async saveProject(): Promise<void> {
  //   if (!this.row['project_name'].trim()) {
  //     this.messageService.add({
  //       severity: 'warn',
  //       summary: 'Validation',
  //       detail: this.config()?.moduleName + ' name is required',
  //     });
  //     return;
  //   }

  //   try {
  //     this.loading = true;
  //     if (this.isEditMode && this.row.id) {
  //       await this.httpService.update(this.config()!.moduleName, this.row.id, this.row);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: this.config()?.moduleName + ' updated successfully',
  //       });
  //     } else {
  //       await this.httpService.create(this.config()!.moduleName, this.row);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: this.config()?.moduleName + ' created successfully',
  //       });
  //     }
  //  //   this.displayDialog = false;
  //     await this.loadData();
  //   } catch (error) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: 'Failed to save ' + this.config()?.moduleName,
  //     });
  //   } finally {
  //     //this.loading = false;
  //   }
  // }

  ngOnDestroy(): void {}
}
