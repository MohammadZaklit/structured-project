import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FileManagerService } from '../../services/file-manager.service';
import { FileManagerConfig, FileItem } from '../../models';

@Component({
  selector: 'fm-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FileUploadModule,
    TooltipModule,
    BreadcrumbModule
  ],
  template: `
    <div class="toolbar-container">
      <div class="toolbar-left">
        <button
          pButton
          type="button"
          icon="pi pi-arrow-up"
          class="p-button-text"
          pTooltip="Go up"
          [disabled]="currentPath === '/'"
          (click)="navigateUp()">
        </button>

        <button
          pButton
          type="button"
          icon="pi pi-refresh"
          class="p-button-text"
          pTooltip="Refresh"
          (click)="refresh()">
        </button>

        <p-breadcrumb [model]="breadcrumbItems" [home]="homeItem" (onItemClick)="onBreadcrumbClick($event)"></p-breadcrumb>
      </div>

      <div class="toolbar-center">
        <span class="p-input-icon-left search-wrapper">
          <i class="pi pi-search"></i>
          <input
            type="text"
            pInputText
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search files..."
            class="search-input" />
        </span>
      </div>

      <div class="toolbar-right">
        <button
          pButton
          type="button"
          icon="pi pi-folder-plus"
          class="p-button-outlined"
          pTooltip="New Folder"
          (click)="showNewFolderDialog = true">
        </button>

        <button
          pButton
          type="button"
          icon="pi pi-upload"
          class="p-button-outlined"
          pTooltip="Upload Files"
          (click)="showUploadDialog = true">
        </button>

        <button
          pButton
          type="button"
          icon="pi pi-trash"
          class="p-button-outlined p-button-danger"
          pTooltip="Delete Selected"
          [disabled]="selectedFiles.length === 0"
          (click)="deleteSelected()">
        </button>
      </div>
    </div>

    <!-- New Folder Dialog -->
    <p-dialog
      header="Create New Folder"
      [(visible)]="showNewFolderDialog"
      [modal]="true"
      [style]="{ width: '400px' }">
      <div class="dialog-content">
        <label for="folderName">Folder Name</label>
        <input
          id="folderName"
          type="text"
          pInputText
          [(ngModel)]="newFolderName"
          class="w-full"
          placeholder="Enter folder name" />
      </div>
      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          label="Cancel"
          class="p-button-text"
          (click)="showNewFolderDialog = false">
        </button>
        <button
          pButton
          type="button"
          label="Create"
          [disabled]="!newFolderName"
          (click)="createFolder()">
        </button>
      </ng-template>
    </p-dialog>

    <!-- Upload Dialog -->
    <p-dialog
      header="Upload Files"
      [(visible)]="showUploadDialog"
      [modal]="true"
      [style]="{ width: '600px' }">
      <div class="upload-container">
        <p-fileUpload
          #fileUpload
          name="file"
          [multiple]="true"
          [customUpload]="true"
          (uploadHandler)="onUpload($event)"
          [auto]="false"
          accept="*/*"
          [maxFileSize]="50000000"
          chooseLabel="Browse Files"
          uploadLabel="Upload"
          cancelLabel="Clear">
          <ng-template pTemplate="header" let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
            <div class="upload-header">
              <button pButton type="button" icon="pi pi-plus" (click)="chooseCallback()" class="p-button-outlined"></button>
              <button pButton type="button" icon="pi pi-upload" (click)="uploadCallback()" [disabled]="!files || files.length === 0" class="p-button-outlined p-button-success"></button>
              <button pButton type="button" icon="pi pi-times" (click)="clearCallback()" [disabled]="!files || files.length === 0" class="p-button-outlined p-button-danger"></button>
            </div>
          </ng-template>
          <ng-template pTemplate="content" let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback" let-removeUploadedFileCallback="removeUploadedFileCallback">
            <div class="upload-content">
              @if (files && files.length > 0) {
                <div class="file-list">
                  @for (file of files; track file.name; let i = $index) {
                    <div class="file-item">
                      <i class="pi pi-file"></i>
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatSize(file.size) }}</span>
                      <button pButton type="button" icon="pi pi-times" (click)="removeFileCallback(i)" class="p-button-text p-button-danger p-button-sm"></button>
                    </div>
                  }
                </div>
              } @else {
                <div class="upload-empty" (click)="fileUpload.choose()">
                  <i class="pi pi-cloud-upload"></i>
                  <p>Drag and drop files here or click to browse</p>
                </div>
              }
            </div>
          </ng-template>
        </p-fileUpload>
      </div>
    </p-dialog>
  `,
  styles: [`
    .toolbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: var(--surface-card, #fff);
      border-bottom: 1px solid var(--surface-border, #e0e0e0);
      gap: 16px;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .toolbar-center {
      flex: 1;
      max-width: 400px;
    }

    .search-wrapper {
      width: 100%;
    }

    .search-input {
      width: 100%;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .dialog-content input {
      width: 100%;
    }

    .upload-container {
      min-height: 250px;
    }

    .upload-header {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .upload-content {
      min-height: 200px;
      border: 2px dashed var(--surface-border, #ddd);
      border-radius: 8px;
      padding: 16px;
    }

    .upload-empty {
      text-align: center;
      padding: 40px;
      color: #888;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .upload-empty:hover {
      background: var(--surface-hover, #f5f5f5);
      border-radius: 6px;
    }

    .upload-empty i {
      font-size: 3rem;
      margin-bottom: 16px;
      display: block;
      color: var(--primary-color, #3b82f6);
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: var(--surface-ground, #f8f9fa);
      border-radius: 6px;
    }

    .file-item i {
      color: var(--primary-color, #3b82f6);
    }

    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      color: #888;
      font-size: 0.85rem;
    }

    .w-full {
      width: 100%;
    }

    :host ::ng-deep .p-breadcrumb {
      background: transparent;
      border: none;
      padding: 0;
    }

    :host ::ng-deep .p-fileupload {
      border: none;
    }

    :host ::ng-deep .p-fileupload-content {
      padding: 0;
      border: none;
    }
  `]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() config!: FileManagerConfig;
  @Output() search = new EventEmitter<string>();

  currentPath = '/';
  searchQuery = '';
  selectedFiles: FileItem[] = [];
  showNewFolderDialog = false;
  showUploadDialog = false;
  newFolderName = '';

  breadcrumbItems: MenuItem[] = [];
  homeItem: MenuItem = { icon: 'pi pi-home', command: () => this.navigateToPath('/') };

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private fileManagerService: FileManagerService) {}

  ngOnInit(): void {
    this.fileManagerService.getCurrentPath()
      .pipe(takeUntil(this.destroy$))
      .subscribe(path => {
        this.currentPath = path;
        this.updateBreadcrumb(path);
      });

    this.fileManagerService.getSelectedFiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(files => {
        this.selectedFiles = files;
      });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.search.emit(query);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateBreadcrumb(path: string): void {
    const parts = path.split('/').filter(p => p);
    let currentPath = '';

    this.breadcrumbItems = parts.map(part => {
      currentPath += '/' + part;
      const pathCopy = currentPath;
      return {
        label: part,
        command: () => this.navigateToPath(pathCopy)
      };
    });
  }

  navigateUp(): void {
    if (this.currentPath === '/') return;

    const parts = this.currentPath.split('/').filter(p => p);
    parts.pop();
    const parentPath = parts.length > 0 ? '/' + parts.join('/') : '/';
    this.navigateToPath(parentPath);
  }

  navigateToPath(path: string): void {
    this.fileManagerService.setCurrentPath(path);
  }

  refresh(): void {
    this.fileManagerService.triggerRefresh();
  }

  onBreadcrumbClick(event: any): void {
    // Handled by command in menu item
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  createFolder(): void {
    if (!this.newFolderName) return;

    this.fileManagerService.createFolder(this.newFolderName, this.currentPath).subscribe({
      next: () => {
        this.showNewFolderDialog = false;
        this.newFolderName = '';
        this.fileManagerService.triggerRefresh();
      }
    });
  }

  onUpload(event: { files: File[] }): void {
    const files = event.files;
    const uploads = this.fileManagerService.uploadFiles(files, this.currentPath);

    uploads.forEach(upload$ => {
      upload$.subscribe({
        next: () => {},
        complete: () => {
          this.fileManagerService.triggerRefresh();
        }
      });
    });

    // Clear the file upload and close dialog
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.showUploadDialog = false;
  }

  deleteSelected(): void {
    if (this.selectedFiles.length === 0) return;

    const deletes = this.fileManagerService.deleteFiles(this.selectedFiles);
    deletes.forEach(delete$ => {
      delete$.subscribe({
        next: () => {
          this.fileManagerService.triggerRefresh();
        }
      });
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
