import { ModuleMetadata } from '@nestjs/common';
export type WinstonLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';
export interface LoggerModuleOptions {
    level?: WinstonLogLevel | 'none';
    timestamp?: boolean;
    disableConsoleAtProd?: boolean;
    maxFileSize?: string;
    maxFiles?: string;
    dir?: string;
    errorLogName?: string;
    appLogName?: string;
}
export interface LoggerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => LoggerModuleOptions | Promise<LoggerModuleOptions>;
    inject?: any[];
}
//# sourceMappingURL=logger.interface.d.ts.map