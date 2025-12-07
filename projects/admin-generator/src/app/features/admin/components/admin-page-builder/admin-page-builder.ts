import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NzStepperConfig, NzWizardFormFieldConfig } from '@zak-lib/ui-library/layouts/form-wizard';
import { NzFormBuilderComponent } from '@zak-lib/ui-library/layouts/form-builder';
import {
  NzFormControl,
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
  NzModuleFieldConfig,
} from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '../../../../shared/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';
import { firstValueFrom } from 'rxjs';
import { NzFieldType } from '@zak-lib/ui-library/elements/form-fields/form-field/field-component-type';

@Component({
  selector: 'app-admin-page-builder',
  imports: [CommonModule, NzFormBuilderComponent],
  templateUrl: './admin-page-builder.html',
  styleUrl: './admin-page-builder.scss',
  standalone: true,
})
export class AdminPageBuilder implements OnInit {
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
        value: field?.configuration?.value || undefined,
        isRequired: field?.configuration?.isRequired || false,
        isDisabled: field?.configuration?.isDisabled || false,
        isVisible: field?.configuration?.isVisible || true,
        apiValidate: field?.configuration?.apiValidate || undefined,
        extraProps: field?.configuration?.extraProps || undefined,
        placeholder: field?.configuration?.placeholder || undefined,
        pattern: field?.configuration?.pattern || undefined,
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
