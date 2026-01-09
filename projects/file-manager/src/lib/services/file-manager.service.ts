import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FileManagerConfig, FileItem, FileUploadResponse, FileOperationResponse, SearchResult } from '../models';

export const FILE_MANAGER_CONFIG = new InjectionToken<FileManagerConfig>('FILE_MANAGER_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private config!: FileManagerConfig;
  private currentPath$ = new BehaviorSubject<string>('/');
  private selectedFiles$ = new BehaviorSubject<FileItem[]>([]);
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  constructor(
    private http: HttpClient,
    @Optional() @Inject(FILE_MANAGER_CONFIG) config: FileManagerConfig
  ) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: FileManagerConfig): void {
    this.config = config;
  }

  getConfig(): FileManagerConfig {
    return this.config;
  }

  private getUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
  }

  // Observable getters
  getCurrentPath(): Observable<string> {
    return this.currentPath$.asObservable();
  }

  getSelectedFiles(): Observable<FileItem[]> {
    return this.selectedFiles$.asObservable();
  }

  getRefreshTrigger(): Observable<void> {
    return this.refreshTrigger$.asObservable();
  }

  // State setters
  setCurrentPath(path: string): void {
    this.currentPath$.next(path);
  }

  setSelectedFiles(files: FileItem[]): void {
    this.selectedFiles$.next(files);
  }

  triggerRefresh(): void {
    this.refreshTrigger$.next();
  }

  // API calls
  listFiles(path: string = '/'): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(this.getUrl(this.config.api.listFile), {
      params: { path }
    });
  }

  uploadFile(file: File, path: string): Observable<HttpEvent<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const req = new HttpRequest('POST', this.getUrl(this.config.api.uploadFile), formData, {
      reportProgress: true
    });

    return this.http.request<FileUploadResponse>(req);
  }

  uploadFiles(files: File[], path: string): Observable<HttpEvent<FileUploadResponse>>[] {
    return files.map(file => this.uploadFile(file, path));
  }

  downloadFile(file: FileItem): Observable<Blob> {
    return this.http.get(this.getUrl(this.config.api.downloadFile), {
      params: { path: file.path },
      responseType: 'blob'
    });
  }

  deleteFile(file: FileItem): Observable<FileOperationResponse> {
    return this.http.delete<FileOperationResponse>(this.getUrl(this.config.api.deleteFile), {
      params: { path: file.path }
    });
  }

  deleteFiles(files: FileItem[]): Observable<FileOperationResponse>[] {
    return files.map(file => this.deleteFile(file));
  }

  createFolder(name: string, parentPath: string): Observable<FileOperationResponse> {
    return this.http.post<FileOperationResponse>(this.getUrl(this.config.api.createFolder), {
      name,
      path: parentPath
    });
  }

  renameFile(file: FileItem, newName: string): Observable<FileOperationResponse> {
    return this.http.put<FileOperationResponse>(this.getUrl(this.config.api.renameFile), {
      path: file.path,
      newName
    });
  }

  searchFiles(query: string, path: string = '/'): Observable<SearchResult> {
    return this.http.get<SearchResult>(this.getUrl(this.config.api.searchFiles), {
      params: { query, path }
    });
  }

  // Utility methods
  getFileIcon(file: FileItem): string {
    if (file.isFolder) {
      return 'pi pi-folder';
    }

    const ext = file.extension?.toLowerCase() || file.name.split('.').pop()?.toLowerCase();

    const iconMap: { [key: string]: string } = {
      pdf: 'pi pi-file-pdf',
      doc: 'pi pi-file-word',
      docx: 'pi pi-file-word',
      xls: 'pi pi-file-excel',
      xlsx: 'pi pi-file-excel',
      ppt: 'pi pi-file',
      pptx: 'pi pi-file',
      jpg: 'pi pi-image',
      jpeg: 'pi pi-image',
      png: 'pi pi-image',
      gif: 'pi pi-image',
      svg: 'pi pi-image',
      mp4: 'pi pi-video',
      avi: 'pi pi-video',
      mov: 'pi pi-video',
      mp3: 'pi pi-volume-up',
      wav: 'pi pi-volume-up',
      zip: 'pi pi-file-export',
      rar: 'pi pi-file-export',
      txt: 'pi pi-file',
      json: 'pi pi-code',
      xml: 'pi pi-code',
      html: 'pi pi-code',
      css: 'pi pi-code',
      js: 'pi pi-code',
      ts: 'pi pi-code'
    };

    return iconMap[ext || ''] || 'pi pi-file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
