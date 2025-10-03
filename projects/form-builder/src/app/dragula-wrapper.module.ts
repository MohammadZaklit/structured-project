// src/app/shared/dragula-wrapper.module.ts
import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [DragulaModule],
  exports: [DragulaModule],
})
export class DragulaWrapperModule {}
