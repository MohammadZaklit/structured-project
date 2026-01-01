import { inject, Injectable } from '@angular/core';
import { NzComponentType } from '@zak-lib/ui-library/composed/component-configuration';
import { NzComponentConfig } from '@zak-lib/ui-library/layouts/form-builder';
import {
  COMPONENTS,
  NzFormControl,
  NzFormFieldSettings,
  NzFormGroup,
  NzModuleFieldConfig,
  NzUiType,
} from '@zak-lib/ui-library/shared';
import { ModuleSettingsService } from '../../../shared/services/module-settings.service';
import { NzWizardFormFieldConfig } from '@zak-lib/ui-library/layouts/form-wizard';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable()
export class AdminFieldsMapperService {
  private moduleSettings = inject(ModuleSettingsService);

  public mapDbFieldsToBuilder(fields: NzModuleFieldConfig[]): NzComponentConfig[] {
    const mappedFields: NzComponentConfig[] = [];

    fields.forEach((field: NzModuleFieldConfig) => {
      const newMappedField = this._mapBuilderFieldConfig(field);
      const filteredFields = this.moduleSettings
        .fields()
        .filter((fld) => fld.parentFieldId === field.id);
      if (filteredFields.length > 0) {
        newMappedField.childComponents = this.mapDbFieldsToBuilder(filteredFields);
      }
      mappedFields.push(newMappedField);
    });
    return mappedFields;
  }

  public mapDbFieldsToWizard(
    fields: NzModuleFieldConfig[],
    form: NzFormGroup,
  ): NzWizardFormFieldConfig[] {
    const mappedFields: NzWizardFormFieldConfig[] = [];

    fields.forEach((field: NzModuleFieldConfig) => {
      const newMappedField = this._mapWizardFieldConfig(field, form);
      const filteredFields = this.moduleSettings
        .fields()
        .filter((fld) => fld.parentFieldId === field.id);
      if (filteredFields.length > 0) {
        const newForm = new NzFormGroup({});
        newMappedField.children = this.mapDbFieldsToWizard(filteredFields, newForm);
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

  private _mapWizardFieldConfig(
    field: NzModuleFieldConfig,
    form: NzFormGroup,
  ): NzWizardFormFieldConfig {
    const fieldType =
      COMPONENTS.find((component) => component.id === field['componentId'])?.componentName ??
      'InputText';

    if (field.isFormField) {
      const control = new NzFormControl();
      const validators: ValidatorFn[] = [];
      if (field.configuration.isRequired) {
        validators.push(Validators.required);
      }
      if (validators.length > 0) {
        control.addValidators(validators);
      }
      form.addControl(field.name, control);
      return {
        type: fieldType as NzFieldType,
        fieldConfig: {
          name: field.name,
          label: field.label,
          hint: field.hint,
          control: control,
          form: form,
          settings: field.configuration,
        },
      };
    } else {
      return {
        type: fieldType as NzUiType,
        componentConfig: {
          name: field.name,
          label: field.label,
          hint: field.hint,
          configuration: field.configuration as NzFormFieldSettings,
        },
      };
    }
  }
}
