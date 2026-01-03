import { inject, Injectable } from '@angular/core';
import {
  COMPONENTS,
  NzFormControl,
  NzFormFieldSettings,
  NzFormGroup,
  NzModuleFieldConfig,
  NzUiType,
} from '@zak-lib/ui-library/shared';
import { ModuleSettingsService } from '../services/module-settings.service';
import { NzWizardFormFieldConfig } from '@zak-lib/ui-library/layouts/form-wizard';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable()
export class WizardFieldsMapperService {
  private moduleSettings = inject(ModuleSettingsService);

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
