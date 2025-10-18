import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { TableGrid, TableGridComponent } from '@zak-lib/ui-library/elements/ui/table-grid';
import { ListView } from './list-view.interface';
import { GenericRecord, HttpService } from '@zak-lib/ui-library/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-list-view',
  imports: [TableGridComponent, ButtonModule, TooltipModule, FormsModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-view.html',
  styleUrl: './list-view.css',
})
export class ListViewComponent implements OnInit {
  @Input() public config: WritableSignal<ListView | undefined> = signal(undefined);
  public tableConfig: WritableSignal<TableGrid | undefined> = signal(undefined);
  tableData: WritableSignal<any[]> = signal([]);
  @Output() onAdvancedSearch = new EventEmitter<void>();
  @Output() addbtnClick = new EventEmitter<void>();
  private isEditMode = false;
  private loading = false;
  private displayDialog = false;

  public quickSearchValue: string = '';
  private messageService = inject(MessageService);
  private httpService = inject(HttpService);
  private confirmationService = inject(ConfirmationService);

  constructor() {}

  ngOnInit(): void {
    this.config()?.table.data?.subscribe((data) => {
      this.tableData.set(data);
      this.tableConfig.set(this.config()?.table);
    });

    this.tableConfig.set(this.config()?.table);
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

  public confirmDelete(row: GenericRecord): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the selected row ?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(row.id!);
      },
    });
  }

  private get moduleName(): string {
    return this.config()!.module.name;
  }

  public async deleteProject(id: number): Promise<void> {
    try {
      await this.httpService.delete(this.moduleName, id);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.moduleName + ' deleted successfully',
      });
      await this.loadData();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete ' + this.moduleName,
      });
    } finally {
      //this.loading = false;
    }
  }

  async loadData(): Promise<void> {
    try {
      // this.loading = true;
      const response = await firstValueFrom(this.httpService.getAll(this.moduleName));
      this.config()!.table.data = of(response);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load ' + this.moduleName + ' data',
      });
    } finally {
      //this.loading = false;
    }
  }

  hideDialog(): void {
    // this.displayDialog = false;
  }

  editRowCallback(rowData: any) {
    console.log('Edit clicked for:', rowData);
    // Implement your edit logic here, e.g., open a dialog
  }

  viewRowCallback(rowData: any) {
    console.log('View clicked for:', rowData);
    // Implement your view logic here
  }

  deleteRowCallback(rowData: any) {
    console.log('Delete clicked for:', rowData);
    // Implement your delete logic here
    // this.data = this.data.filter((p) => p.id !== rowData.id);
    // this.tableData$ = of(this.data);
    // this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ })); // Update observable
  }

  reorderRowCallback(event: any) {
    console.log('Row reordered:', event);
    // Update your underlying data array to reflect the new order
    //const draggedItem = this.data[event.dragIndex];
    //this.data.splice(event.dragIndex, 1);
    //this.data.splice(event.dropIndex, 0, draggedItem);
    //this.tableData$ = of([...this.data]); // Create new observable to trigger change detection
    //this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ }));
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
}
