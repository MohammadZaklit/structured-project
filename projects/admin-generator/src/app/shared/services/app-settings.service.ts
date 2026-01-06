import { inject, Injectable } from '@angular/core';
import { NzGenericRecord, NzHttpService } from '@zak-lib/ui-library/shared';
import { forkJoin, map, Observable } from 'rxjs';
import { CONSTANTS } from '../constants/constants';

@Injectable()
export class AppSettingsService {
  private httpService = inject(NzHttpService);
  constructor() {}

  getMenuItems(): Observable<any[]> {
    const menuGroupsAPI = this.httpService.getAll('menu_groups');
    const modulesAPI = this.httpService.getAll(CONSTANTS.MAIN_MODULE.NAME, {
      menuGroupId: 'NOT_NULL',
    });
    return forkJoin({
      menuGroups: menuGroupsAPI,
      modules: modulesAPI,
    }).pipe(
      map(({ menuGroups, modules }) => {
        return menuGroups
          .map((group) => {
            group['children'] = modules.filter((mod) => mod['menuGroupId'] === group.id);

            return group;
          })
          .filter((group) => group['children'].length > 0);
      }),
    );
  }
}
