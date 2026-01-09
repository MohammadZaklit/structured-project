import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';
import { Subject, takeUntil } from 'rxjs';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { FileListComponent } from '../file-list/file-list.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FileManagerService } from '../../services/file-manager.service';
import { FileManagerConfig, FileItem } from '../../models';

@Component({
  selector: 'fm-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    SplitterModule,
    FileTreeComponent,
    FileListComponent,
    ToolbarComponent
  ],
  template: `
    <div class="file-manager-container">
      <fm-toolbar
        [config]="config"
        (search)="onSearch($event)">
      </fm-toolbar>

      <div class="file-manager-content">
        <p-splitter [style]="{ height: '100%' }" [panelSizes]="[25, 75]" [minSizes]="[15, 50]">
          <ng-template pTemplate>
            <div class="tree-panel">
              <fm-file-tree
                [config]="config"
                (folderSelected)="onFolderSelected($event)"
                (fileSelected)="onFileSelected($event)">
              </fm-file-tree>
            </div>
          </ng-template>
          <ng-template pTemplate>
            <div class="list-panel">
              <fm-file-list
                [config]="config"
                (fileDoubleClick)="onFileDoubleClick($event)"
                (selectionChange)="onSelectionChange($event)">
              </fm-file-list>
            </div>
          </ng-template>
        </p-splitter>
      </div>
    </div>
  `,
  styles: [`
    .file-manager-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--surface-ground, #f8f9fa);
      border: 1px solid var(--surface-border, #e0e0e0);
      border-radius: 6px;
      overflow: hidden;
    }

    .file-manager-content {
      flex: 1;
      overflow: hidden;
    }

    .tree-panel, .list-panel {
      height: 100%;
      overflow: auto;
      background: var(--surface-card, #fff);
    }

    .tree-panel {
      padding: 8px;
      border-right: 1px solid var(--surface-border, #e0e0e0);
    }

    .list-panel {
      padding: 8px;
    }

    :host ::ng-deep .p-splitter {
      border: none;
    }

    :host ::ng-deep .p-splitter-panel {
      overflow: hidden;
    }
  `]
})
export class FileManagerComponent implements OnInit, OnDestroy {
  @Input() config!: FileManagerConfig;
  @Output() fileSelect = new EventEmitter<FileItem>();
  @Output() folderSelect = new EventEmitter<FileItem>();
  @Output() fileOpen = new EventEmitter<FileItem>();
  @Output() selectionChange = new EventEmitter<FileItem[]>();

  private destroy$ = new Subject<void>();

  constructor(private fileManagerService: FileManagerService) {}

  ngOnInit(): void {
    if (this.config) {
      this.fileManagerService.setConfig(this.config);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFolderSelected(folder: FileItem): void {
    this.folderSelect.emit(folder);
  }

  onFileSelected(file: FileItem): void {
    this.fileSelect.emit(file);
  }

  onFileDoubleClick(file: FileItem): void {
    this.fileOpen.emit(file);
  }

  onSelectionChange(files: FileItem[]): void {
    this.selectionChange.emit(files);
  }

  onSearch(query: string): void {
    if (query) {
      this.fileManagerService.searchFiles(query).subscribe({
        next: (result) => {
          // Search results are handled via the service
        }
      });
    } else {
      this.fileManagerService.triggerRefresh();
    }
  }
}
