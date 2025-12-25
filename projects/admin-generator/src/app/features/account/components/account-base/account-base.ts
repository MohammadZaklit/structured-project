import { Component, Input } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
@Component({
  selector: 'app-account-base',
  imports: [FluidModule],
  template: `<p-fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  </p-fluid>`,
  styles: ``,
})
export class AccountBaseComponent {
  @Input() formTitle!: string;
}
