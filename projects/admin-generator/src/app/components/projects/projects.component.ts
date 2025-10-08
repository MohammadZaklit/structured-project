import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Project } from '../../models/project.model';
import { GenericRecord, HttpService } from '../../services/http.service';
import { delay, firstValueFrom, Observable, of } from 'rxjs';
import {
  TableGridComponent,
  TableGrid,
  TableColumn,
  TableAction,
} from '@zak-lib/ui-library/elements/ui/table-grid';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TableGridComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ProjectsComponent implements OnInit {
  data: GenericRecord[] = [];
  displayDialog = false;
  row: GenericRecord = { project_name: '' };
  isEditMode = false;
  loading = false;
  private moduleName = 'projects';

  tableData$: Observable<GenericRecord[]> | undefined;

  tableConfig = signal<TableGrid | undefined>(undefined);

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.tableData$ = of(this.data).pipe(delay(100)); // Simulate async data

    const columns: TableColumn[] = [
      { field: 'code', header: 'Code', type: 'string', sortable: true, filter: true },
      { field: 'name', header: 'Product Name', type: 'string', sortable: true, filter: true },
      { field: 'description', header: 'Description', type: 'string', sortable: false },
      {
        field: 'longTextDescription',
        header: 'Detailed Info',
        type: 'long-string',
        sortable: false,
      },
      { field: 'category', header: 'Category', type: 'string', sortable: true, filter: true },
      { field: 'price', header: 'Price', type: 'number', sortable: true },
      { field: 'quantity', header: 'Quantity', type: 'number', sortable: true },
      { field: 'inventoryStatus', header: 'Status', type: 'string', sortable: true },
      { field: 'dateAdded', header: 'Date Added', type: 'date', sortable: true },
    ];

    const dynamicActions: TableAction[] = [
      {
        label: 'Approve',
        icon: 'pi pi-check',
        callback: (rowData) => {
          console.log('Approve:', rowData);
        },
        styleClass: 'p-button-success p-button-text',
        tooltip: 'Approve Item',
        disabled: (rowData) => rowData.inventoryStatus === 'INSTOCK', // Disable if already in stock
      },
      {
        label: 'Log',
        icon: 'pi pi-history',
        callback: (rowData) => {
          console.log('Log History for:', rowData.name);
        },
        styleClass: 'p-button-secondary p-button-text',
        tooltip: 'View History',
        visible: (rowData) => rowData.id !== '2', // Hide for specific row
      },
    ];

    const dynamicHeaderButtons: TableAction[] = [
      {
        label: 'Refresh Data',
        icon: 'pi pi-refresh',
        callback: () => {
          console.log('Refreshing Data...');
          this.updateData();
        },
        styleClass: 'p-button-secondary',
        tooltip: 'Refresh Table Data',
      },
      {
        label: 'Upload',
        icon: 'pi pi-upload',
        callback: () => {
          console.log('Opening Upload Dialog...');
        },
        styleClass: 'p-button-info',
        tooltip: 'Upload File',
        disabled: () => false, // Example of always enabled
        visible: () => true, // Example of always visible
      },
    ];

    const config: TableGrid = {
      columns: columns,
      data: this.tableData$,
      paginator: true,
      rows: 5,
      showCurrentPageReport: true,
      rowsPerPageOptions: [5, 10, 20],
      sortableRows: true,
      rowSelection: 'multiple',
      enableStaticActions: {
        edit: true,
        delete: true,
        view: true,
      },
      dynamicActions: dynamicActions,
      enableColumnSorting: true,
      showQuickSearch: true,
      showAddButton: true,
      dynamicHeaderButtons: dynamicHeaderButtons,
      exportToExcel: true,
      exportFileName: 'ProductsList',
    };

    this.tableConfig.set(config);
  }

  async loadData(): Promise<void> {
    try {
      this.loading = true;
      this.data = await firstValueFrom(this.httpService.getAll(this.moduleName));
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load ' + this.moduleName + ' data',
      });
    } finally {
      this.loading = false;
    }
  }

  public showAddDialog(): void {
    this.row = { project_name: '' };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  public showEditDialog(project: Project): void {
    this.row = { ...project };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  public async saveProject(): Promise<void> {
    if (!this.row['project_name'].trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: this.moduleName + ' name is required',
      });
      return;
    }

    try {
      this.loading = true;
      if (this.isEditMode && this.row.id) {
        await this.httpService.update(this.moduleName, this.row.id, this.row);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.moduleName + ' updated successfully',
        });
      } else {
        await this.httpService.create(this.moduleName, this.row);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.moduleName + ' created successfully',
        });
      }
      this.displayDialog = false;
      await this.loadData();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save ' + this.moduleName,
      });
    } finally {
      this.loading = false;
    }
  }

  public confirmDelete(row: Project): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ` + this.moduleName + ` "${row.project_name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(row.id!);
      },
    });
  }

  public async deleteProject(id: number): Promise<void> {
    try {
      this.loading = true;
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
      this.loading = false;
    }
  }

  hideDialog(): void {
    this.displayDialog = false;
  }

  handleEdit(rowData: any) {
    console.log('Edit clicked for:', rowData);
    // Implement your edit logic here, e.g., open a dialog
  }

  handleView(rowData: any) {
    console.log('View clicked for:', rowData);
    // Implement your view logic here
  }

  handleDelete(rowData: any) {
    console.log('Delete clicked for:', rowData);
    // Implement your delete logic here
    this.data = this.data.filter((p) => p.id !== rowData.id);
    this.tableData$ = of(this.data);
    this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ })); // Update observable
  }

  handleRowReorder(event: any) {
    console.log('Row reordered:', event);
    // Update your underlying data array to reflect the new order
    const draggedItem = this.data[event.dragIndex];
    this.data.splice(event.dragIndex, 1);
    this.data.splice(event.dropIndex, 0, draggedItem);
    this.tableData$ = of([...this.data]); // Create new observable to trigger change detection
    this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ }));
  }

  handleAdvancedSearch() {
    console.log('Advanced Search button clicked. Open advanced search dialog/component.');
    // Emit an event or open a modal for advanced search
  }

  handleColumnSort(event: any) {
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
    // Simulate data update
    const newProduct: GenericRecord = {
      id: this.data.length + 1,
      code: 'xyz' + (this.data.length + 1),
      name: `New Product ${this.data.length + 1}`,
      description: `Description of new product ${this.data.length + 1}`,
      price: Math.floor(Math.random() * 200) + 50,
      quantity: Math.floor(Math.random() * 50),
      inventoryStatus: Math.random() > 0.5 ? 'INSTOCK' : 'LOWSTOCK',
      category: 'Gadgets',
      rating: Math.floor(Math.random() * 5) + 1,
      dateAdded: new Date(),
      longTextDescription: `This is a brand new item added at ${new Date().toLocaleTimeString()}. It has some exciting features you will love.`,
    };
    this.data.push(newProduct);
    this.tableData$ = of([...this.data]).pipe(delay(100)); // Create a new observable
    this.tableConfig.update((cfg) => ({ ...cfg!, data: this.tableData$ })); // Update the signal to trigger ngOnChanges
  }

  addNewItem() {
    this.handleAddItem();
  }
}
