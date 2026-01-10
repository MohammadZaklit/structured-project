import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzAutoComplete extends NzFormField, NzBaseSelect {
  optionLabel?: string;
  optionValue?: string;
}

@Component({
  selector: 'nz-autocomplete',
  imports: [AutoCompleteModule, NzFormFieldModule],
  template: `<nz-form-field [baseConfig]="config">
    <p-autoComplete
      [formControl]="config.control"
      [dropdown]="true"
      [suggestions]="options()"
      [optionLabel]="'label'"
      [optionValue]="config.optionValue || undefined"
      [placeholder]="config.settings?.placeholder || ''"
      (completeMethod)="onSearch($event)"
      [invalid]="config.control.invalid && (config.control.dirty || config.control.touched)"
    ></p-autoComplete>
  </nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzAutocompleteComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzAutoComplete;

  options = signal<NzOption[]>([]);
  httpService = inject(NzHttpService);

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
              id: this.config.optionValue ? row[this.config.optionValue] : row.id,
              label: this.config.optionLabel
                ? this.config.optionLabel
                : row['title'] || row['name'] || row['label'] || '',
            },
          ]
        : [],
    );

    this.options.set(newOptions);
  }
  onSearch(event: { query: string }) {
    const query = event.query.toLowerCase();

    this.options.set(this.options().filter((opt) => opt.label.toLowerCase().includes(query)));
  }
}
