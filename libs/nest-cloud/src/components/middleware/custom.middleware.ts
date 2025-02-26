import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CustomMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // 注入请求服务信息
    res.header('X-Powered-By', process.env.CS_NAME);
    next();
  }
}
