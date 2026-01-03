import { Injectable } from '@angular/core';
import { ModuleSettingsService } from './module-settings.service';

@Injectable()
export class BuilderSettingsService extends ModuleSettingsService {
  constructor() {
    super();
  }
}
