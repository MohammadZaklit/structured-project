import { Component } from '@angular/core';
import { FileManagerComponent } from '@zak-lib/file-manager/components';
import { FileManagerConfig, DownloadModeEnum, FileItem } from '@zak-lib/file-manager/models';

@Component({
  selector: 'app-file-manager-demo',
  standalone: true,
  imports: [FileManagerComponent],
  template: `
    <div class="demo-container">
      <h2>File Manager Demo</h2>
      <fm-file-manager
        [config]="fileManagerConfig"
        (fileSelect)="onFileSelect($event)"
        (folderSelect)="onFolderSelect($event)"
        (fileOpen)="onFileOpen($event)"
        (selectionChange)="onSelectionChange($event)">
      </fm-file-manager>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
    }

    fm-file-manager {
      display: block;
      height: 600px;
    }
  `]
})
export class FileManagerDemoComponent {
  fileManagerConfig: FileManagerConfig = {
    baseURL: 'http://localhost:3000/',
    api: {
      listFile: 'api/file/list',
      uploadFile: 'api/file/upload',
      downloadFile: 'api/file/download',
      deleteFile: 'api/file/remove',
      createFolder: 'api/file/directory',
      renameFile: 'api/file/rename',
      searchFiles: 'api/file/search'
    },
    options: {
      allowFolderDownload: DownloadModeEnum.DOWNLOAD_FILES,
      showFilesInsideTree: false,
      openFolderOnDoubleClick: true,
      showFolderOptions: false
    }
  };

  onFileSelect(file: FileItem): void {
    console.log('File selected:', file);
  }

  onFolderSelect(folder: FileItem): void {
    console.log('Folder selected:', folder);
  }

  onFileOpen(file: FileItem): void {
    console.log('File opened:', file);
  }

  onSelectionChange(files: FileItem[]): void {
    console.log('Selection changed:', files);
  }
}
