import { Request, Response } from 'express';
import { NestMiddleware } from '@nestjs/common';
export declare class CustomMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): void;
}
//# sourceMappingURL=custom.middleware.d.ts.map