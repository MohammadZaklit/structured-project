// src/app/services/dropdown.service.ts
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NzGenericRecord, NzHttpService } from '@zak-lib/ui-library/shared';

export interface ModuleOption {
  id: number; // adjust based on your API response
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private httpService = inject(NzHttpService);

  constructor() {}

  getDropdownList(): Observable<NzGenericRecord[]> {
    return this.httpService.getAll<NzGenericRecord[]>('modules');
  }
}
