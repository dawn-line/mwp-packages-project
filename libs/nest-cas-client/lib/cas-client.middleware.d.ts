import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CasClientService } from './cas-client.service';
import { CasOptions } from './cas-options.interface';
interface User {
    userId?: string;
    [key: string]: any;
}
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare class StaticAuthMiddleware implements NestMiddleware {
    private readonly options;
    private readonly casClient;
    constructor(options: CasOptions, casClient: CasClientService);
    private getFullUrl;
    private isUserLoggedIn;
    private handleTicketValidation;
    private setUserToSession;
    private setSessionCookie;
    private redirectToLogin;
    private handleTgtValidation;
    private removeTicketFromUrl;
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export {};
//# sourceMappingURL=cas-client.middleware.d.ts.map