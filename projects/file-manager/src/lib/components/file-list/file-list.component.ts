import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerService } from '../../services/file-manager.service';
import { FileItem, FileManagerConfig, DownloadModeEnum } from '../../models';

@Component({
  selector: 'fm-file-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ContextMenuModule, TooltipModule],
  template: `
    <div class="file-list-container">
      <p-table
        [value]="files"
        [loading]="loading"
        [(selection)]="selectedFiles"
        [paginator]="files.length > 20"
        [rows]="20"
        [rowHover]="true"
        selectionMode="multiple"
        dataKey="id"
        [contextMenu]="cm"
        (onRowSelect)="onRowSelect($event)"
        (onRowUnselect)="onRowUnselect($event)"
        styleClass="p-datatable-sm p-datatable-striped">

        <ng-template pTemplate="header">
          <tr>
            <th style="width: 3rem">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th pSortableColumn="name">
              Name <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="size" style="width: 120px">
              Size <p-sortIcon field="size"></p-sortIcon>
            </th>
            <th pSortableColumn="modifiedDate" style="width: 180px">
              Modified <p-sortIcon field="modifiedDate"></p-sortIcon>
            </th>
            <th style="width: 100px">Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-file let-rowIndex="rowIndex">
          <tr [pSelectableRow]="file" [pContextMenuRow]="file" (dblclick)="onDoubleClick(file)">
            <td>
              <p-tableCheckbox [value]="file"></p-tableCheckbox>
            </td>
            <td>
              <div class="file-name-cell">
                <i [class]="getFileIcon(file)" class="file-icon"></i>
                <span>{{ file.name }}</span>
              </div>
            </td>
            <td>{{ file.isFolder ? '--' : formatFileSize(file.size) }}</td>
            <td>{{ file.modifiedDate | date:'short' }}</td>
            <td>
              <div class="action-buttons">
                <button
                  pButton
                  type="button"
                  icon="pi pi-download"
                  class="p-button-text p-button-sm"
                  pTooltip="Download"
                  [disabled]="!canDownload(file)"
                  (click)="downloadFile(file)">
                </button>
                <button
                  pButton
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm p-button-danger"
                  pTooltip="Delete"
                  (click)="deleteFile(file)">
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5" class="empty-message">
              <i class="pi pi-folder-open"></i>
              <span>No files in this folder</span>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-contextMenu #cm [model]="contextMenuItems"></p-contextMenu>
    </div>
  `,
  styles: [`
    .file-list-container {
      height: 100%;
      overflow: auto;
    }

    .file-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .file-icon {
      font-size: 1.2rem;
      color: var(--primary-color, #3b82f6);
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .empty-message {
      text-align: center;
      padding: 40px !important;
      color: #888;
    }

    .empty-message i {
      font-size: 3rem;
      display: block;
      margin-bottom: 10px;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      cursor: pointer;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: var(--surface-hover, #f5f5f5);
    }
  `]
})
export class FileListComponent implements OnInit, OnDestroy {
  @Input() config!: FileManagerConfig;
  @Output() fileDoubleClick = new EventEmitter<FileItem>();
  @Output() selectionChange = new EventEmitter<FileItem[]>();

  files: FileItem[] = [];
  selectedFiles: FileItem[] = [];
  loading = false;
  contextMenuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(private fileManagerService: FileManagerService) {}

  ngOnInit(): void {
    this.setupContextMenu();

    this.fileManagerService.getCurrentPath()
      .pipe(takeUntil(this.destroy$))
      .subscribe(path => {
        this.loadFiles(path);
      });

    this.fileManagerService.getRefreshTrigger()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fileManagerService.getCurrentPath()
          .pipe(takeUntil(this.destroy$))
          .subscribe(path => this.loadFiles(path));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupContextMenu(): void {
    this.contextMenuItems = [
      {
        label: 'Open',
        icon: 'pi pi-folder-open',
        command: () => this.openSelected()
      },
      {
        label: 'Download',
        icon: 'pi pi-download',
        command: () => this.downloadSelected(),
        visible: this.config?.options?.allowFolderDownload !== DownloadModeEnum.DOWNLOAD_DISABLED
      },
      {
        label: 'Rename',
        icon: 'pi pi-pencil',
        command: () => this.renameSelected()
      },
      {
        separator: true
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteSelected()
      }
    ];
  }

  private loadFiles(path: string): void {
    this.loading = true;
    this.fileManagerService.listFiles(path).subscribe({
      next: (files) => {
        this.files = files;
        this.loading = false;
        this.selectedFiles = [];
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getFileIcon(file: FileItem): string {
    return this.fileManagerService.getFileIcon(file);
  }

  formatFileSize(bytes?: number): string {
    return bytes ? this.fileManagerService.formatFileSize(bytes) : '--';
  }

  canDownload(file: FileItem): boolean {
    const downloadMode = this.config?.options?.allowFolderDownload;
    if (downloadMode === DownloadModeEnum.DOWNLOAD_DISABLED) {
      return false;
    }
    if (file.isFolder && downloadMode === DownloadModeEnum.DOWNLOAD_FILES) {
      return false;
    }
    return true;
  }

  onDoubleClick(file: FileItem): void {
    this.fileDoubleClick.emit(file);
    if (file.isFolder) {
      this.fileManagerService.setCurrentPath(file.path);
    }
  }

  onRowSelect(event: any): void {
    this.selectionChange.emit(this.selectedFiles);
    this.fileManagerService.setSelectedFiles(this.selectedFiles);
  }

  onRowUnselect(event: any): void {
    this.selectionChange.emit(this.selectedFiles);
    this.fileManagerService.setSelectedFiles(this.selectedFiles);
  }

  downloadFile(file: FileItem): void {
    if (!this.canDownload(file)) return;

    this.fileManagerService.downloadFile(file).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  deleteFile(file: FileItem): void {
    this.fileManagerService.deleteFile(file).subscribe({
      next: () => {
        this.fileManagerService.triggerRefresh();
      }
    });
  }

  private openSelected(): void {
    if (this.selectedFiles.length === 1) {
      this.onDoubleClick(this.selectedFiles[0]);
    }
  }

  private downloadSelected(): void {
    this.selectedFiles.forEach(file => {
      if (this.canDownload(file)) {
        this.downloadFile(file);
      }
    });
  }

  private renameSelected(): void {
    // Emit event to parent to handle rename dialog
  }

  private deleteSelected(): void {
    this.selectedFiles.forEach(file => {
      this.deleteFile(file);
    });
  }
}
