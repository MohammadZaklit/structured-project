import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import {
  FormFieldConfig,
  FormWizardComponent,
  StepperConfig,
} from '@zak-lib/ui-library/layouts/form-wizard';
import { GenericRecord, HttpService, ModuleConfig } from '@zak-lib/ui-library/shared';
import { components } from 'projects/admin-generator/src/app/shared/constants/components';
import { ModuleSettingsService } from 'projects/admin-generator/src/app/shared/services/module-settings.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-page-form',
  imports: [CommonModule, FormWizardComponent],
  templateUrl: './admin-page-form.html',
  styleUrl: './admin-page-form.scss',
  standalone: true,
})
export class AdminPageForm implements OnInit {
  public dbFields: FormFieldConfig[] = [];
  public module!: ModuleConfig;
  public data?: GenericRecord;
  private moduleSettings = inject(ModuleSettingsService);
  private httpService = inject(HttpService);
  public stepConfig: StepperConfig = {
    steps: [{ id: 1, label: 'Form', name: 'singleForm', icon: 'pi pi-user' }],
  };

  @Input() public id?: number;
  @Output() public cancelForm = new EventEmitter<void>();
  @Output() public successForm = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.module = this.moduleSettings.module() as ModuleConfig;
    this.dbFields = this.moduleSettings.fields().map((field) => {
      return Object.assign(field, {
        type:
          components.find((component) => component.id === field['componentId'])?.componentName ??
          'InputText',
        step: 1,
      });
    });

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
