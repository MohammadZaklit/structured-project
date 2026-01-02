import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NzStepperConfig } from '@zak-lib/ui-library/layouts/form-wizard';
import {
  FormBuilderComponent,
  NzComponentConfig,
  NzFormBuilder,
  NzFormBuilderComponent,
} from '@zak-lib/ui-library/layouts/form-builder';
import {
  NzFormControl,
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
  NzModuleFieldConfig,
} from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '@zak-lib/ui-library/shared';
import { ModuleSettingsService } from '../../../../shared/services/module-settings.service';
import { take } from 'rxjs';
import { NzComponentType } from '@zak-lib/ui-library/composed/component-configuration';
import { AdminFieldsMapperService } from '../../services/fields-mapper.service';
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
  private moduleSettings = inject(ModuleSettingsService);
  private httpService = inject(NzHttpService);
  private fieldsMapperService = inject(AdminFieldsMapperService);

  public form = new NzFormGroup({});
  public formBuilderConfig!: NzFormBuilder;

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as NzModuleConfig;

    const topLevelFields = this.moduleSettings.fields().filter((fld) => !fld.parentFieldId);
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
      newFields.push({
        id: row.id || null,
        sortOrder: index,
        moduleId: this.module.id,
        componentId: component?.id || 10,
        referenceModuleId: undefined,
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
}
