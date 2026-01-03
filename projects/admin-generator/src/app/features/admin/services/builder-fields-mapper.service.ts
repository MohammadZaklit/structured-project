import { inject, Injectable } from '@angular/core';
import { NzComponentType } from '@zak-lib/ui-library/composed/component-configuration';
import { NzComponentConfig } from '@zak-lib/ui-library/layouts/form-builder';
import { COMPONENTS, NzModuleFieldConfig } from '@zak-lib/ui-library/shared';
import { BuilderSettingsService } from './builder-settings.service';

@Injectable()
export class BuilderFieldsMapperService {
  private builderSettings = inject(BuilderSettingsService);

  public mapDbFieldsToBuilder(fields: NzModuleFieldConfig[]): NzComponentConfig[] {
    const mappedFields: NzComponentConfig[] = [];

    fields.forEach((field: NzModuleFieldConfig) => {
      const newMappedField = this._mapBuilderFieldConfig(field);
      const filteredFields = this.builderSettings
        .fields()
        .filter((fld) => fld.parentFieldId === field.id);
      if (filteredFields.length > 0) {
        newMappedField.childComponents = this.mapDbFieldsToBuilder(filteredFields);
      }
      mappedFields.push(newMappedField);
    });
    return mappedFields;
  }

  private _mapBuilderFieldConfig(field: NzModuleFieldConfig): NzComponentConfig {
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
}
