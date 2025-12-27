import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NzLoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const NzhttpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(NzLoaderService);

  if (req.headers.has('X-Skip-Loader')) {
    return next(req);
  }

  loaderService.show();

  return next(req).pipe(finalize(() => loaderService.hide()));
};
