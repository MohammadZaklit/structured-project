import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { NzAuthService } from '../services/auth.service';
// Automatically attaches a JWT token to every outgoing HTTP request
@Injectable()
export class NzAuthInterceptor implements HttpInterceptor {
  constructor(private auth: NzAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();

    if (!token) return next.handle(req);

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq);
  }
}
