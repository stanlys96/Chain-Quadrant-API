// src/middleware/ip-whitelist.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedIps: string[] = [
      '123.456.789.0',
      '111.222.333.444',
      '127.0.0.1',
      '::1',
    ];
    const clientIp = req.ip || req.connection.remoteAddress; // Get client IP address
    console.log(req.ip);
    console.log(req.connection.remoteAddress);
    if (allowedIps.includes(clientIp)) {
      next();
    } else {
      throw new ForbiddenException('Access Denied: Unauthorized IP address');
    }
  }
}
