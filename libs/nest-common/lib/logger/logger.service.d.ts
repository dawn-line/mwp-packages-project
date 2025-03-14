import { LoggerService as NestLoggerService } from '@nestjs/common';
import { LoggerModuleOptions, WinstonLogLevel } from './logger.interface';
import { Logger as WinstonLogger } from 'winston';
export declare class LoggerService implements NestLoggerService {
    protected context?: string;
    protected options: LoggerModuleOptions;
    private static lastTimestampAt?;
    private logDir;
    private winstonLogger;
    constructor();
    constructor(context: string, options: LoggerModuleOptions);
    private initWinston;
    protected getLogDir(): string;
    protected getWinstonLogger(): WinstonLogger;
    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    error(message: any, context?: string): void;
    error(message: any, stack?: string, context?: string): void;
    error(message: any, ...optionalParams: [...any, string?, string?]): void;
    warn(message: any, context?: string): void;
    warn(message: any, ...optionalParams: [...any, string?]): void;
    debug(message: any, context?: string): void;
    debug(message: any, ...optionalParams: [...any, string?]): void;
    verbose(message: any, context?: string): void;
    verbose(message: any, ...optionalParams: [...any, string?]): void;
    protected isConsoleLevelEnabled(level: WinstonLogLevel): boolean;
    protected isWinstonLevelEnabled(level: WinstonLogLevel): boolean;
    protected getTimestamp(): string;
    protected recordMessages(messages: unknown[], context?: string, logLevel?: WinstonLogLevel, stack?: string): void;
    protected printMessages(messages: unknown[], context?: string, logLevel?: WinstonLogLevel, writeStreamType?: 'stdout' | 'stderr'): void;
    protected printStackTrace(stack: string): void;
    private updateAndGetTimestampDiff;
    private getContextAndMessagesToPrint;
    private getContextAndStackAndMessagesToPrint;
    private getColorByLogLevel;
}
//# sourceMappingURL=logger.service.d.ts.map