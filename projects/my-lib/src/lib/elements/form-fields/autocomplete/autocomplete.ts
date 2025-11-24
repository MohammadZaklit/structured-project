import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzAutoComplete extends NzFormField, NzBaseSelect {}

@Component({
  selector: 'nz-autocomplete',
  imports: [AutoCompleteModule, NzFormFieldModule],
  template: `<nz-form-field
    ><p-autoComplete
      [formControl]="config.control"
      [suggestions]="options()"
      [dropdown]="true"
      [placeholder]="config.placeholder || ''"
    ></p-autoComplete
  ></nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzAutocomplete extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzAutoComplete;

  options = signal<NzOption[]>([]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.config.api) {
      this.getOptions(this.config.api);
    } else if (this.config.options) {
      this.options.set(this.config.options);
    }
  }

  async getOptions(api: string): Promise<void> {
    const httpService = inject(NzHttpService);
    const data = await firstValueFrom(httpService.getAll(api));
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
