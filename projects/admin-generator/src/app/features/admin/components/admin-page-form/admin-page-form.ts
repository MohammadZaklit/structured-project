import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  NzFormFieldConfig,
  NzFormWizardComponent,
  NzStepperConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';
import { NzGenericRecord, NzHttpService, NzModuleConfig } from '@zak-lib/ui-library/shared';
import { COMPONENTS } from '../../../../shared/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-page-form',
  imports: [CommonModule, NzFormWizardComponent],
  templateUrl: './admin-page-form.html',
  styleUrl: './admin-page-form.scss',
  standalone: true,
})
export class AdminPageForm implements OnInit {
  public dbFields: NzFormFieldConfig[] = [];
  public module!: NzModuleConfig;
  public data?: NzGenericRecord;
  private moduleSettings = inject(ModuleSettingsService);
  private httpService = inject(NzHttpService);
  public stepConfig: NzStepperConfig = {
    steps: [{ id: 1, label: 'Form', name: 'singleForm', icon: 'pi pi-user' }],
  };

  @Input() public id?: number;
  @Output() public cancelForm = new EventEmitter<void>();
  @Output() public successForm = new EventEmitter<any>();
  @Output() public backCallback = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as NzModuleConfig;
    this.dbFields = this.moduleSettings.fields().map((field) => {
      return Object.assign(field, {
        type:
          COMPONENTS.find((component) => component.id === field['componentId'])?.componentName ??
          'InputText',
        step: 1,
      });
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

  private async getData(id: number): Promise<void> {
    this.data = await firstValueFrom(this.httpService.getById(this.module.name, id));
  }

  public onFormSubmit(data: any): void {
    this.successForm.emit(data);
  }
}
