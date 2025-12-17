import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { PickListModule } from 'primeng/picklist';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzPickList extends NzFormField, NzBaseSelect {}

@Component({
  selector: 'nz-picklist',
  imports: [NzFormFieldModule, PickListModule],
  template: `<nz-form-field [baseConfig]="config"
    ><p-picklist
      [formControl]="config.control"
      [source]="sourceOptions()"
      [target]="targetOptions()"
    ></p-picklist
  ></nz-form-field>`,
  styles: ``,
  standalone: true,
})
export class NzPickListComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzPickList;

  sourceOptions = signal<NzOption[]>([]);
  targetOptions = signal<NzOption[]>([]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.config.api) {
      this.getOptions(this.config.api);
    } else if (this.config.options) {
      this.sourceOptions.set(this.config.options);
    }
  }

  async getOptions(api: string): Promise<void> {
    const httpService = inject(NzHttpService);
    const data = await firstValueFrom(httpService.getAll(api));
    const newOptions = data.flatMap(
      // flat all data in one array
      (row) =>
        row.id
          ? [
              {
                id: row.id,
                label: row['title'] || row['name'] || row['label'] || '',
              },
            ]
          : [],
    );

    this.sourceOptions.set(newOptions);
  }
}
