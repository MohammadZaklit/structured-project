import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzPickList extends NzFormField, NzBaseSelect {
  optionLabel?: string;
  optionValue?: string;
}

@Component({
  selector: 'nz-picklist',
  standalone: true,
  imports: [NzFormFieldModule, PickListModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-picklist
        [formControl]="config.control"
        [source]="sourceOptions()"
        [target]="targetOptions()"
        [sourceHeader]="config.settings?.dataSource?.label || 'Available'"
        [targetHeader]="config.settings?.dataSource?.label || 'Selected'"
        [dragdrop]="true"
      ></p-picklist>
    </nz-form-field>
  `,
})
export class NzPickListComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzPickList;

  sourceOptions = signal<NzOption[]>([]);
  targetOptions = signal<NzOption[]>([]);

  private httpService = inject(NzHttpService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.config) return;

    this.config.hideLabel = true;

    const settings = this.config.settings;

    if (settings?.dataSource) {
      this.getOptions(settings.dataSource.label);
    } else if (settings?.dataOptions) {
      this.sourceOptions.set(settings.dataOptions);
    }

    // If initial selected values exist
    if (settings?.dataOptions) {
      this.targetOptions.set(settings.dataOptions);
    }
  }

  private async getOptions(api: string): Promise<void> {
    const data = await firstValueFrom(this.httpService.getAll(api));

    const newOptions = data.flatMap((row) =>
      row.id
        ? [
            {
              id: this.config.optionValue ? row[this.config.optionValue] : row.id,
              label: this.config.optionLabel
                ? row[this.config.optionLabel]
                : row['title'] || row['name'] || row['label'] || '',
            },
          ]
        : [],
    );

    this.sourceOptions.set(newOptions);
  }
}
