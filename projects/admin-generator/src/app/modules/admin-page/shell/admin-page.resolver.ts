import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ModuleSettingsService } from '../../../shared/services/module-settings.service';
import { inject } from '@angular/core';

export const AdminPageResolver: ResolveFn<any> = async (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const api = inject(ModuleSettingsService);
  const router = inject(Router);
  try {
    const moduleParam = route.paramMap.get('module');
    if (moduleParam) {
      const moduleConfig = await api.getModuleByName(moduleParam);
      if (moduleConfig) {
        const fieldsConfig = await api.getModuleFields(moduleConfig.id);
        return { moduleConfig, fieldsConfig };
      } else {
        router.navigate(['/404']);
        return null;
      }
    }
  } catch (err) {
    router.navigate(['/404']);
    return null;
  }
  return null;
};
