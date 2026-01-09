import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TreeSelectModule } from 'primeng/treeselect';
import { NzFormField, NzFormFieldComponent } from '../form-field/form-field';
import { NzFormFieldModule } from '../form-field/form-field-module';
import { NzOption, NzBaseSelect } from '../interfaces/base-select.interface';
import { NzHttpService } from '@zak-lib/ui-library/shared';
import { firstValueFrom } from 'rxjs';

export interface NzTreeSelect extends NzFormField, NzBaseSelect {
  optionLabel?: string; // label field in API
  optionValue?: string; // value field in API
}

@Component({
  selector: 'nz-tree-select',
  standalone: true,
  imports: [NzFormFieldModule, TreeSelectModule],
  template: `
    <nz-form-field [baseConfig]="config">
      <p-treeSelect
        [formControl]="config.control"
        [options]="nodes()"
        [placeholder]="config.settings?.placeholder || 'Select'"
        [selectionMode]="'single'"
        [filter]="true"
        [showClear]="true"
      ></p-treeSelect>
    </nz-form-field>
  `,
})
export class NzTreeSelectComponent extends NzFormFieldComponent implements OnInit {
  @Input() config!: NzTreeSelect;

  nodes = signal<NzOption[]>([]);
  private httpService = inject(NzHttpService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.config) return;

    this.config.hideLabel = true;

    const settings = this.config.settings;

    if (settings?.dataSource) {
      this.getOptions(settings.dataSource);
    } else if (settings?.dataOptions) {
      this.nodes.set(this.mapTreeNodes(settings.dataOptions));
    }
  }

  private async getOptions(api: string): Promise<void> {
    const data = await firstValueFrom(this.httpService.getAll(api));

    const treeData = this.mapTreeNodes(data);
    this.nodes.set(treeData);
  }

  private mapTreeNodes(data: any[]): NzOption[] {
    return data.map((row) => ({
      id: this.config.optionValue ? row[this.config.optionValue] : row.id,
      label: this.config.optionLabel
        ? row[this.config.optionLabel]
        : row['title'] || row['name'] || row['label'] || '',
      children: row.children ? this.mapTreeNodes(row.children) : [],
    }));
  }
}
