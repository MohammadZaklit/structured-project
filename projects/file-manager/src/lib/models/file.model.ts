export interface FileItem {
  id: string | number;
  name: string;
  path: string;
  isFolder: boolean;
  size?: number;
  type?: string;
  extension?: string;
  modifiedDate?: Date | string;
  createdDate?: Date | string;
  children?: FileItem[];
  parent?: string;
  icon?: string;
}

export interface FileUploadResponse {
  success: boolean;
  file?: FileItem;
  message?: string;
}

export interface FileOperationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface SearchResult {
  files: FileItem[];
  totalCount: number;
}
