import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

export interface NzMultiSelect extends NzFormField, NzBaseSelect {}

@Component({
  selector: 'nz-multiselect',
  imports: [NzFormFieldModule, MultiSelectModule],
  template: `<nz-form-field [baseConfig]="config"
    ><p-multi-select
      [formControl]="config.control"
      [options]="options()"
      [placeholder]="config.settings?.placeholder || ''"
    ></p-multi-select
  ></nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzMultiSelectComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzMultiSelect;
  httpService = inject(NzHttpService);
  options = signal<NzOption[]>([]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    const settings = this.config.settings;
    if (settings?.dataSource) {
      this.getOptions(settings?.dataSource.label);
    } else if (settings?.dataOptions) {
      this.options.set(settings?.dataOptions);
    }
  }

  async getOptions(api: string): Promise<void> {
    const data = await firstValueFrom(this.httpService.getAll(api));
    const newOptions = data.flatMap((row) =>
      row.id
        ? [
            {
              id: row.id,
              label: row['title'] || row['name'] || row['label'] || '',
            },
          ]
        : [],
    );

    this.options.set(newOptions);
  }
}
