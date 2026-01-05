import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import {
  FormBuilderComponent,
  NzComponentConfig,
  NzFormBuilder,
  NzFormBuilderComponent,
} from '@zak-lib/ui-library/layouts/form-builder';
import {
  NzFormGroup,
  NzHttpService,
  NzModuleConfig,
  NzModuleFieldConfig,
} from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '@zak-lib/ui-library/shared';
import { take } from 'rxjs';

import { BuilderFieldsMapperService } from '../../services/builder-fields-mapper.service';
import { BuilderSettingsService } from '../../services/builder-settings.service';
interface NzModuleFieldPayload extends NzModuleFieldConfig {
  children: NzModuleFieldPayload[];
}
@Component({
  selector: 'app-admin-page-builder',
  imports: [CommonModule, NzFormBuilderComponent],
  templateUrl: './admin-page-builder.html',
  styleUrl: './admin-page-builder.scss',
  standalone: true,
})
export class AdminPageBuilder implements OnInit {
  public dbFields: NzComponentConfig[] = [];
  public module!: NzModuleConfig;
  private builderSettings = inject(BuilderSettingsService);
  private httpService = inject(NzHttpService);
  private fieldsMapperService = inject(BuilderFieldsMapperService);

  public form = new NzFormGroup({});
  public formBuilderConfig!: NzFormBuilder;

  constructor() {}

  ngOnInit(): void {
    this.module = this.builderSettings.module() as NzModuleConfig;
    const topLevelFields = this.builderSettings.fields().filter((fld) => !fld.parentFieldId);
    this.dbFields = this.fieldsMapperService.mapDbFieldsToBuilder(topLevelFields);
    this.formBuilderConfig = {
      module: this.module,
      components: this.dbFields,
    };
  }

  public saveData(data: FormBuilderComponent[]): void {
    const payload = this.mapDataToSave(data);
    this.httpService
      .post('builder/save-fields', payload)
      .pipe(take(1))
      .subscribe((response) => {
        console.warn('response: ', response);
      });
  }

  private mapDataToSave(data: FormBuilderComponent[], parentId?: number): NzModuleFieldPayload[] {
    const newFields: NzModuleFieldPayload[] = [];
    data.forEach((row, index) => {
      const component = COMPONENTS.find((component) => component.componentName === row.type);

      const referenceModuleId = row.configuration['settings'].dataSource || undefined;
      newFields.push({
        id: row.id || null,
        sortOrder: index,
        moduleId: this.module.id,
        componentId: component?.id || 10,
        referenceModuleId: referenceModuleId,
        parentFieldId: parentId,
        isDeleted: row.isDeleted,
        isDefault: false,
        isFormField: row.isFormField,
        name: row.configuration['name'] || component?.componentName || '',
        label: row.configuration['label'] || component?.label || '',
        hint: row.configuration['hint'],
        configuration: row.configuration['settings'],
        children: this.mapDataToSave(row.childComponents, row.id || undefined),
      });
    });
    return newFields;
  }

  migrateModule(): void {
    this.httpService
      .post('builder/migrate', { module: this.module })
      .pipe(take(1))
      .subscribe((response) => {
        console.warn('response: ', response);
      });
  }
}
