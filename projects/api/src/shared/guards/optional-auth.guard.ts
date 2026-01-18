import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return true; // No JWT, continue
    }

    try {
      const token = authHeader.split(' ')[1];
      const secret = this.configService.get<string>('jwt.secret');
      if (secret) {
        request.user = jwt.verify(token, secret);
      }
    } catch {
      // Ignore invalid token
    }

    return true;
  }
}
