import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '@cs/nest-common';
import { ConfigService } from '@cs/nest-config';
export declare class UnifiedExceptionFilter implements ExceptionFilter {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService, logger: LoggerService);
    private isHttpException;
    private getErrorMessage;
    catch(exception: any, host: ArgumentsHost): void | Response<any, Record<string, any>>;
}
//# sourceMappingURL=exception.filter.d.ts.map