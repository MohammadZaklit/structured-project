import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzCheckBox extends NzFormField, NzBaseSelect {
  optionLabel?: string;
  optionValue?: string;
}

@Component({
  selector: 'nz-checkbox',
  standalone: true,
  imports: [FormsModule, CommonModule, CheckboxModule, NzFormFieldModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-checkbox
        *ngFor="let opt of options()"
        [binary]="false"
        [value]="opt.id"
        [formControl]="config.control"
      ></p-checkbox>
    </nz-form-field>
  `,
})
export class NzCheckBoxComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzCheckBox;

  options = signal<NzOption[]>([]);
  httpService = inject(NzHttpService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    const settings = this.config.settings;

    if (settings?.dataSource) {
      this.getOptions(settings.dataSource);
    } else if (settings?.dataOptions) {
      this.options.set(settings.dataOptions);
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
                ? row[this.config.optionLabel]
                : row['title'] || row['name'] || row['label'] || '',
            },
          ]
        : [],
    );

    this.options.set(newOptions);
  }
}
