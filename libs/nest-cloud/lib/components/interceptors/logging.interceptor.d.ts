import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggerService } from '@cs/nest-common';
import { ConfigService } from '@cs/nest-config';
import { Observable } from 'rxjs';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService, logger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
//# sourceMappingURL=logging.interceptor.d.ts.map