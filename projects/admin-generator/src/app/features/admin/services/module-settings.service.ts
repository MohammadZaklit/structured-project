import { inject, Injectable, signal } from '@angular/core';
import {
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
  NzModuleFieldConfig,
} from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';
import { CONSTANTS } from '../../../shared/constants/constants';

@Injectable()
export class ModuleSettingsService {
  private httpService = inject(NzHttpService);
  private modulesTable = CONSTANTS.MAIN_MODULE.NAME;
  private fieldsTable = CONSTANTS.MAIN_MODULE_FIELDS.NAME;

  public module = signal<NzModuleConfig | undefined>(undefined);
  public fields = signal<NzModuleFieldConfig[]>([]);
  constructor() {}

  public async getModuleConfig(id: number): Promise<NzGenericRecord> {
    const config = (await firstValueFrom(
      this.httpService.getById(this.modulesTable, id),
    )) as NzModuleConfig;
    this.module.set(config);
    return config;
  }

  public async getModuleByName(
    moduleName: string,
    updateSettings = false,
  ): Promise<NzModuleConfig | null> {
    const config = (await firstValueFrom(
      this.httpService.getAll(this.modulesTable, { name: moduleName }),
    )) as NzModuleConfig[];

    if (config.length > 0) {
      if (updateSettings) {
        this.module.set(config[0]);
      }

      return config[0];
    }

    return null;
  }

  public async getModuleFields(
    moduleId: number,
    updateSettings = false,
  ): Promise<NzModuleFieldConfig[]> {
    const response = await firstValueFrom(
      this.httpService.getAll<NzModuleFieldConfig>(this.fieldsTable, {
        moduleId: moduleId,
      }),
    );
    if (updateSettings) {
      this.fields.set(response);
    }

    return response;
  }

  public getPrimaryField(fields: NzGenericRecord[]): string {
    return fields[0]['field_name'];
  }

  public getLabelField(fields: NzGenericRecord[]): string {
    return fields[0]['field_name'];
  }
}
