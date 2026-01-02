// src/app/services/dropdown.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModuleOption {
  id: number; // adjust based on your API response
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private apiUrl = 'http://localhost:3000/api/modules';

  constructor(private http: HttpClient) {}

  getDropdownList(): Observable<ModuleOption[]> {
    return this.http.get<ModuleOption[]>(this.apiUrl);
  }
}
