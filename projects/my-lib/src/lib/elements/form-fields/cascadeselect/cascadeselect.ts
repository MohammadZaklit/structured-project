import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzBaseSelect, NzOption } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { firstValueFrom } from 'rxjs';

export interface NzCascadeSelect extends NzFormField, NzBaseSelect {
  optionLabel?: string; // label field name
  optionValue?: string; // value field name
  optionChildren?: string; // children field name
}

@Component({
  selector: 'nz-cascade-select',
  standalone: true,
  imports: [CascadeSelectModule, NzFormFieldModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-cascadeSelect
        [loading]="true"
        [formControl]="config.control"
        [options]="options()"
        [optionLabel]="config.optionLabel || 'label'"
        [optionGroupLabel]="config.optionLabel || 'label'"
        [optionGroupChildren]="[config.optionChildren || 'children']"
        [placeholder]="config.settings?.placeholder || ''"
        [invalid]="config.control.invalid && (config.control.dirty || config.control.touched)"
      >
      </p-cascadeSelect>
    </nz-form-field>
  `,
})
export class NzCascadeSelectComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzCascadeSelect;

  options = signal<any[]>([]);
  httpService = inject(NzHttpService);

  ngOnInit(): void {
    const settings = this.config.settings;

    if (settings?.dataSource) {
      this.getOptions(settings.dataSource.label);
    } else if (settings?.dataOptions) {
      this.options.set(settings.dataOptions);
    }
  }

  async getOptions(api: string): Promise<void> {
    const data = await firstValueFrom(this.httpService.getAll(api));
    const mappedOptions = this.mapToCascade(data);
    this.options.set(mappedOptions);
  }

  /**
   * Recursively maps API data to PrimeNG CascadeSelect structure
   */
  private mapToCascade(data: any[]): NzOption[] {
    return data.map((item) => ({
      id: this.config.optionValue ? item[this.config.optionValue] : item.id,
      label: this.config.optionLabel
        ? item[this.config.optionLabel]
        : item.title || item.name || item.label || '',
      children: item[this.config.optionChildren || 'children']
        ? this.mapToCascade(item[this.config.optionChildren || 'children'])
        : [],
    }));
  }
}
