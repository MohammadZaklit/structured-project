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
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';
import { firstValueFrom, take } from 'rxjs';
import { NzComponentType } from '@zak-lib/ui-library/composed/component-configuration';
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
  public data?: NzGenericRecord;
  private moduleSettings = inject(ModuleSettingsService);
  private httpService = inject(NzHttpService);
  public stepConfig: NzStepperConfig = {
    steps: [{ id: 1, label: 'Form', name: 'singleForm', icon: 'pi pi-user' }],
  };

  public form = new NzFormGroup({});

  @Input() public id?: number;
  @Output() public cancelForm = new EventEmitter<void>();
  @Output() public successForm = new EventEmitter<any>();
  @Output() public backCallback = new EventEmitter<any>();

  public formBuilderConfig!: NzFormBuilder;

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as NzModuleConfig;

    const mapDbFields = (fields: NzModuleFieldConfig[]): NzComponentConfig[] => {
      const mappedFields: NzComponentConfig[] = [];

      fields.forEach((field: NzModuleFieldConfig) => {
        const newMappedField = this.mapFieldConfig(field);
        const filteredFields = this.moduleSettings
          .fields()
          .filter((fld) => fld.parentFieldId === field.id);
        if (filteredFields.length > 0) {
          newMappedField.childComponents = mapDbFields(filteredFields);
        }
        mappedFields.push(newMappedField);
      });
      return mappedFields;
    };

    const topLevelFields = this.moduleSettings.fields().filter((fld) => !fld.parentFieldId);
    this.dbFields = mapDbFields(topLevelFields);
    this.formBuilderConfig = {
      module: this.module,
      components: this.dbFields,
    };
  }

  private mapFieldConfig(field: NzModuleFieldConfig): NzComponentConfig {
    const fieldType =
      COMPONENTS.find((component) => component.id === field['componentId'])?.componentName ??
      'InputText';

    return {
      id: field.id,
      isNew: false,
      isDeleted: false,
      isFormField: field.isFormField,
      label: field.label,
      childComponents: [],
      configuration: {
        name: field.name,
        label: field.label,
        hint: field.hint,
        settings: field.configuration,
      },
      type: fieldType as NzComponentType,
    };
  }

  public saveData(data: FormBuilderComponent[]): void {
    const payload = this.mapData(data);
    this.httpService
      .post('builder/save-fields', payload)
      .pipe(take(1))
      .subscribe((response) => {
        console.warn('response: ', response);
      });
  }

  private mapData(data: FormBuilderComponent[], parentId?: number): NzModuleFieldPayload[] {
    const newFields: NzModuleFieldPayload[] = [];
    data.forEach((row, index) => {
      const component = COMPONENTS.find((component) => component.componentName === row.type);
      newFields.push({
        id: row.isDeleted ? -1 : row.id || null,
        sortOrder: index,
        moduleId: this.module.id,
        componentId: component?.id || 10,
        referenceModuleId: undefined,
        parentFieldId: parentId,
        isDefault: false,
        isFormField: row.isFormField,
        name: row.configuration['name'] || component?.componentName || '',
        label: row.configuration['label'] || component?.label || '',
        hint: row.configuration['hint'],
        configuration: row.configuration['settings'],
        children: this.mapData(row.childComponents, row.id || undefined),
      });
    });
    return newFields;
  }
}
