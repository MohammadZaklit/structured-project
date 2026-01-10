import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzFormWizardComponent,
  NzStepperConfig,
  NzWizardFormFieldConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';
import {
  COMPONENTS,
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
} from '@zak-lib/ui-library/shared';
import { ModuleSettingsService } from '../../services/module-settings.service';
import { firstValueFrom } from 'rxjs';
import { WizardFieldsMapperService } from '../../services/wizard-fields-mapper.service';
import {
  isMultiSelectComponent,
  NzFieldType,
  NzFormFieldLoaderConfig,
} from '@zak-lib/ui-library/elements/form-fields/form-field';

@Component({
  selector: 'app-admin-page-form',
  imports: [CommonModule, NzFormWizardComponent],
  templateUrl: './admin-page-form.html',
  styleUrl: './admin-page-form.scss',
  standalone: true,
})
export class AdminPageForm {
  public dbFields: NzWizardFormFieldConfig[] = [];
  public module!: NzModuleConfig;
  public data?: NzGenericRecord;
  private moduleSettings = inject(ModuleSettingsService);
  private httpService = inject(NzHttpService);
  private fieldsMapperService = inject(WizardFieldsMapperService);
  public stepConfig: NzStepperConfig = {
    steps: [
      {
        id: 1,
        label: 'Form',
        name: 'singleForm',
        icon: 'pi pi-user',
        components: [],
      },
    ],
  };

  public form!: NzFormGroup;

  @Input() public id?: number;
  @Output() public cancelForm = new EventEmitter<void>();
  @Output() public successForm = new EventEmitter<any>();
  @Output() public backCallback = new EventEmitter<any>();

  constructor() {
    effect(() => {
      const module = this.moduleSettings.module();
      if (module) {
        this.initConfig(module);
      }
    });
  }

  initConfig(module: NzModuleConfig): void {
    this.form = new NzFormGroup({});
    this.module = module;
    const topLevelFields = this.moduleSettings.fields().filter((fld) => !fld.parentFieldId);
    this.stepConfig.steps[0].components = this.fieldsMapperService.mapDbFieldsToWizard(
      topLevelFields,
      this.form,
    );

    this.stepConfig.backBtn = {
      position: 'inline',
      btnCallback: () => {
        return new Promise((resolve, reject) => {
          this.backCallback.emit();
          resolve();
        });
      },
    };

    if (this.id) {
      this.getData(this.id);
    }
  }

  private async getData(id: number): Promise<void> {
    const row = await firstValueFrom(this.httpService.getById(this.module.name, id));
    const formFields = this.moduleSettings.fields().filter((fld) => fld.isFormField);
    formFields.forEach((field) => {
      const componentType =
        COMPONENTS.find((component) => component.id === field.componentId)?.componentName ||
        'InputText';
      if (isMultiSelectComponent(componentType as NzFieldType)) {
        if (row[field.name]) {
          row[field.name] = row[field.name].map((data: NzGenericRecord) => {
            return {
              id: data.id,
              label: data['label'] || data['title'] || data['name'] || '',
            };
          });
        }
      }
    });
    this.data = row;
  }

  public onFormSubmit(data: any): void {
    this.successForm.emit(data);
  }
}
