import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'nz-Multiselect',
  imports: [MultiSelectModule, FormsModule, MultiSelectModule],
  template: `<p-multiselect
    [options]="cities"
    [(ngModel)]="selectedCities"
    optionLabel="name"
    placeholder="Select Cities"
    [maxSelectedLabels]="3"
    class="w-full md:w-80"
  />`,
})
export class NzMultiselectComponent {
  cities: any[] | undefined;
  selectedCities: any;
}
