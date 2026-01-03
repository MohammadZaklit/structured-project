import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzFormWizardComponent,
  NzStepperConfig,
  NzWizardFormFieldConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';
import {
  NzFormGroup,
  NzGenericRecord,
  NzHttpService,
  NzModuleConfig,
} from '@zak-lib/ui-library/shared';
import { ModuleSettingsService } from '../../services/module-settings.service';
import { firstValueFrom } from 'rxjs';
import { WizardFieldsMapperService } from '../../services/wizard-fields-mapper.service';

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

  public form = new NzFormGroup({});

  @Input() public id?: number;
  @Output() public cancelForm = new EventEmitter<void>();
  @Output() public successForm = new EventEmitter<any>();
  @Output() public backCallback = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as NzModuleConfig;
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
    this.data = await firstValueFrom(this.httpService.getById(this.module.name, id));
  }

  public onFormSubmit(data: any): void {
    this.successForm.emit(data);
  }
}
