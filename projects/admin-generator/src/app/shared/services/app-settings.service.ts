import { inject, Injectable } from '@angular/core';
import { GenericRecord, HttpService } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../constants/constants';

@Injectable()
export class AppSettingsService {
  private httpService = inject(HttpService);
  constructor() {}

  getMenuItems(): Observable<GenericRecord[]> {
    return this.httpService.getAll(CONSTANTS.MAIN_MODULE.NAME);
  }
}
