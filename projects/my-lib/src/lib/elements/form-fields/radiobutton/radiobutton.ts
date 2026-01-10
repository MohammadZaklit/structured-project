import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzRadioButton extends NzFormField, NzBaseSelect {
  optionLabel?: string;
  optionValue?: string;
}

@Component({
  selector: 'nz-radio-button',
  standalone: true,
  imports: [NzFormFieldModule, RadioButtonModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <div *ngFor="let opt of options()">
        <p-radioButton
          [formControl]="config.control"
          [name]="config.name"
          [value]="opt.id"
        ></p-radioButton>
        <label>{{ opt.label }}</label>
      </div>
    </nz-form-field>
  `,
})
export class NzRadioButtonComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzRadioButton;

  options = signal<NzOption[]>([]);
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
      this.options.set(settings.dataOptions);
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
