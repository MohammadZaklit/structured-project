import { inject, Injectable, signal } from '@angular/core';
import { FieldConfig, GenericRecord, HttpService, ModuleConfig } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';
import { FormFieldConfig } from '@zak-lib/ui-library/layouts/form-wizard';

@Injectable()
export class ModuleSettingsService {
  private httpService = inject(HttpService);
  private modulesTable = 'modules';
  private fieldsTable = 'module_fields';

  public module = signal<ModuleConfig | undefined>(undefined);
  public fields = signal<FieldConfig[]>([]);
  constructor() {}

  public async getModuleConfig(id: number): Promise<GenericRecord> {
    const config = (await firstValueFrom(
      this.httpService.getById(this.modulesTable, id)
    )) as ModuleConfig;
    this.module.set(config);
    return config;
  }

  public async getModuleByName(moduleName: string): Promise<ModuleConfig | null> {
    const config = (await firstValueFrom(
      this.httpService.getAll(this.modulesTable, { name: moduleName })
    )) as ModuleConfig[];

    if (config.length > 0) {
      this.module.set(config[0]);
      return config[0];
    }

    return null;
  }

  public async getModuleFields(moduleId: number): Promise<FieldConfig[]> {
    const response = await firstValueFrom(
      this.httpService.getAll<FieldConfig>(this.fieldsTable, {
        moduleId: moduleId,
      })
    );
    this.fields.set(response);
    return response;
  }

  public getPrimaryField(fields: GenericRecord[]): string {
    return fields[0]['field_name'];
  }

  public getLabelField(fields: GenericRecord[]): string {
    return fields[0]['field_name'];
  }
}
