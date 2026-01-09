import { DownloadModeEnum } from './download-mode.enum';

export interface ApiConfig {
  listFile: string;
  uploadFile: string;
  downloadFile: string;
  deleteFile: string;
  createFolder: string;
  renameFile: string;
  searchFiles: string;
}

export interface OptionsConfig {
  allowFolderDownload: DownloadModeEnum;
  showFilesInsideTree: boolean;
  openFolderOnDoubleClick: boolean;
  showFolderOptions: boolean;
}

export interface FileManagerConfig {
  baseURL: string;
  api: ApiConfig;
  options: OptionsConfig;
}
