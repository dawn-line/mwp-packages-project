import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@cs/nest-common';
import { CasClientService } from './cas-client.service';
import { CasOptions } from './cas-options.interface';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare class CasClientMiddleware implements NestMiddleware {
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
//# sourceMappingURL=cas-client.middleware.d.ts.map