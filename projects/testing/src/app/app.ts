import { Component } from '@angular/core';
import { NzPickListComponent } from '@zak-lib/ui-library/elements/form-fields/picklist';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NzPickListComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {}
