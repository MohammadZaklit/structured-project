import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { BuilderSettingsService } from '../services/builder-settings.service';

export const AdminBuilderResolver: ResolveFn<any> = async (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const api = inject(BuilderSettingsService);
  const router = inject(Router);
  try {
    const moduleParam = route.paramMap.get('moduleName');
    if (moduleParam) {
      const moduleConfig = await api.getModuleByName(moduleParam, true);
      if (moduleConfig) {
        const fieldsConfig = await api.getModuleFields(moduleConfig.id, true);
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
