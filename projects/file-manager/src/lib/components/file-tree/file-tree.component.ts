import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeNode, MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerService } from '../../services/file-manager.service';
import { FileItem, FileManagerConfig } from '../../models';

@Component({
  selector: 'fm-file-tree',
  standalone: true,
  imports: [CommonModule, TreeModule, ContextMenuModule],
  template: `
    <div class="file-tree-container">
      <p-tree
        [value]="treeNodes"
        [loading]="loading"
        selectionMode="single"
        [(selection)]="selectedNode"
        (onNodeSelect)="onNodeSelect($event)"
        (onNodeExpand)="onNodeExpand($event)"
        (onNodeContextMenuSelect)="onContextMenu($event)"
        [contextMenu]="cm"
        scrollHeight="100%"
        class="file-tree">
        <ng-template let-node pTemplate="default">
          <div class="tree-node-content" (dblclick)="onNodeDoubleClick(node)">
            <i [class]="node.icon" class="node-icon"></i>
            <span class="node-label">{{ node.label }}</span>
          </div>
        </ng-template>
      </p-tree>

      <p-contextMenu #cm [model]="contextMenuItems"></p-contextMenu>
    </div>
  `,
  styles: [`
    .file-tree-container {
      height: 100%;
      overflow: auto;
    }

    .file-tree {
      border: none;
    }

    .tree-node-content {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .node-icon {
      font-size: 1.1rem;
      color: var(--primary-color, #3b82f6);
    }

    .node-label {
      font-size: 0.9rem;
    }

    :host ::ng-deep .p-tree {
      border: none;
      padding: 0;
    }

    :host ::ng-deep .p-tree .p-tree-container .p-treenode {
      padding: 2px 0;
    }
  `]
})
export class FileTreeComponent implements OnInit, OnDestroy {
  @Input() config!: FileManagerConfig;
  @Output() folderSelected = new EventEmitter<FileItem>();
  @Output() fileSelected = new EventEmitter<FileItem>();

  treeNodes: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  loading = false;
  contextMenuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(private fileManagerService: FileManagerService) {}

  ngOnInit(): void {
    this.setupContextMenu();
    this.loadRootFolder();

    this.fileManagerService.getRefreshTrigger()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshCurrentNode();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupContextMenu(): void {
    if (this.config?.options?.showFolderOptions) {
      this.contextMenuItems = [
        {
          label: 'New Folder',
          icon: 'pi pi-folder-plus',
          command: () => this.createNewFolder()
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
  }

  private loadRootFolder(): void {
    this.loading = true;
    this.fileManagerService.listFiles('/').subscribe({
      next: (files) => {
        this.treeNodes = this.mapFilesToTreeNodes(files);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private mapFilesToTreeNodes(files: FileItem[]): TreeNode[] {
    const showFiles = this.config?.options?.showFilesInsideTree ?? false;

    return files
      .filter(file => showFiles || file.isFolder)
      .map(file => ({
        key: file.id.toString(),
        label: file.name,
        data: file,
        icon: this.fileManagerService.getFileIcon(file),
        leaf: !file.isFolder,
        children: file.isFolder ? [] : undefined
      }));
  }

  onNodeSelect(event: { node: TreeNode }): void {
    const file = event.node.data as FileItem;
    if (file.isFolder) {
      this.folderSelected.emit(file);
      this.fileManagerService.setCurrentPath(file.path);
    } else {
      this.fileSelected.emit(file);
    }
  }

  onNodeDoubleClick(node: TreeNode): void {
    const file = node.data as FileItem;
    if (file.isFolder && this.config?.options?.openFolderOnDoubleClick) {
      this.folderSelected.emit(file);
      this.fileManagerService.setCurrentPath(file.path);
    }
  }

  onNodeExpand(event: { node: TreeNode }): void {
    const node = event.node;
    const file = node.data as FileItem;

    if (file.isFolder && (!node.children || node.children.length === 0)) {
      node.loading = true;
      this.fileManagerService.listFiles(file.path).subscribe({
        next: (files) => {
          node.children = this.mapFilesToTreeNodes(files);
          node.loading = false;
        },
        error: () => {
          node.loading = false;
        }
      });
    }
  }

  onContextMenu(event: { node: TreeNode }): void {
    this.selectedNode = event.node;
  }

  private createNewFolder(): void {
    // Emit event to parent to handle folder creation dialog
  }

  private renameSelected(): void {
    // Emit event to parent to handle rename dialog
  }

  private deleteSelected(): void {
    if (this.selectedNode) {
      const file = this.selectedNode.data as FileItem;
      this.fileManagerService.deleteFile(file).subscribe({
        next: () => {
          this.fileManagerService.triggerRefresh();
        }
      });
    }
  }

  private refreshCurrentNode(): void {
    if (this.selectedNode) {
      const file = this.selectedNode.data as FileItem;
      if (file.isFolder) {
        this.selectedNode.children = [];
        this.onNodeExpand({ node: this.selectedNode });
      }
    } else {
      this.loadRootFolder();
    }
  }
}
