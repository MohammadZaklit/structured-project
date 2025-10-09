import { inject, Injectable } from '@angular/core';
import { GenericRecord, HttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private httpService = inject(HttpService);
  private modulesTable = 'modules';
  private fieldsTable = 'module_fields';
  constructor() {}

  public async getModuleConfig(id: number): Promise<GenericRecord> {
    const response = await firstValueFrom(this.httpService.getById(this.modulesTable, id));
    return response || [];
  }

  public async getModuleFields(moduleId: number): Promise<GenericRecord[] | []> {
    const response = await firstValueFrom(
      this.httpService.getAll(this.fieldsTable, {
        module_id: moduleId,
      })
    );

    return response || [];
  }

  public getPrimaryField(fields: GenericRecord[]): string {
    return fields[0]['field_name'];
  }

  public getLabelField(fields: GenericRecord[]): string {
    return fields[0]['field_name'];
  }
}
