import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzListBox extends NzFormField, NzBaseSelect {
  optionLabel?: string;
  optionValue?: string;
}

@Component({
  selector: 'nz-listbox',
  standalone: true,
  imports: [ListboxModule, NzFormFieldModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-listbox
        [formControl]="config.control"
        [options]="options()"
        [optionLabel]="config.optionLabel || 'label'"
        [optionValue]="config.optionValue || 'id'"
        [multiple]="true"
      ></p-listbox>
    </nz-form-field>
  `,
})
export class NzListboxComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzListBox;

  options = signal<NzOption[]>([]);
  private httpService = inject(NzHttpService);

  ngOnInit(): void {
    if (this.config) {
      this.config.hideLabel = true;

      const settings = this.config.settings;

      if (settings?.dataSource) {
        this.getOptions(settings.dataSource.label);
      } else if (settings?.dataOptions) {
        this.options.set(settings.dataOptions);
      }
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

    this.options.set(newOptions);
  }
}
