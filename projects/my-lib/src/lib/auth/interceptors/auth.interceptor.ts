import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { NzAuthService } from '../services/auth.service';
import { SKIP_AUTH } from '../tokens/auth.token';

export const NzAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(NzAuthService);

  if (req.context.get(SKIP_AUTH)) {
    /**
     * this.http.get('/public', {
     *     context: new HttpContext().set(SKIP_AUTH, true),
     *  });
     */
    return next(req);
  }

  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
