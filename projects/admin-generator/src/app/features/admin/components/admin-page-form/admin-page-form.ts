import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzFormWizardComponent,
  NzStepperConfig,
  NzWizardFormFieldConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';
import {
  NzFormControl,
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
  NzModuleFieldConfig,
} from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '../../../../../../../my-lib/src/lib/shared/src/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';
import { firstValueFrom } from 'rxjs';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field/field-component-type';

@Component({
  selector: 'app-admin-page-form',
  imports: [CommonModule, NzFormWizardComponent],
  templateUrl: './admin-page-form.html',
  styleUrl: './admin-page-form.scss',
  standalone: true,
})
export class AdminPageForm implements OnInit {
  public dbFields: NzWizardFormFieldConfig[] = [];
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

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as NzModuleConfig;

    this.moduleSettings.fields().forEach((field: NzModuleFieldConfig) => {
      this.dbFields.push(this.mapFieldConfig(field));
    });

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

  private mapFieldConfig(field: NzModuleFieldConfig): NzWizardFormFieldConfig {
    const fieldType =
      COMPONENTS.find((component) => component.id === field['componentId'])?.componentName ??
      'InputText';

    const newControl = new NzFormControl(null);
    this.form.addControl(field.name, newControl);

    return {
      type: fieldType as NzFieldType,
      step: 1,
      fieldConfig: {
        control: newControl,
        form: this.form,
        name: field.name,
        label: field.label,
        hint: field.hint || undefined,
        settings: field?.configuration,
      },
    };
  }

  private async getData(id: number): Promise<void> {
    this.data = await firstValueFrom(this.httpService.getById(this.module.name, id));
  }

  public onFormSubmit(data: any): void {
    this.successForm.emit(data);
  }
}
