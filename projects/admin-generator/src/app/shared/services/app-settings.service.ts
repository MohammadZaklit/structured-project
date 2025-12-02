import { inject, Injectable } from '@angular/core';
import { NzGenericRecord, NzHttpService } from '@zak-lib/ui-library/shared';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../constants/constants';

@Injectable()
export class AppSettingsService {
  private httpService = inject(NzHttpService);
  constructor() {}

  getMenuItems(): Observable<NzGenericRecord[]> {
    return this.httpService.getAll(CONSTANTS.MAIN_MODULE.NAME);
  }
}
