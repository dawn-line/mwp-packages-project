import { ModuleMetadata } from '@nestjs/common';
export type ConfigFrom = 'gitea' | 'nacos';
export interface ConfigOptions {
    configFilePath?: string;
    configFrom?: ConfigFrom;
    onlyLocal?: boolean;
}
export interface ConfigAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => ConfigSchema | Promise<ConfigSchema>;
    inject?: any[];
}
export interface ConfigSchema {
    name: string;
    port: number;
    serverPath: string;
    env?: env;
    docs?: Documnet;
    logger?: Logger;
    cas?: object;
    mysql?: Record<string, Mysql>;
    redis?: Redis;
    disableConsole?: boolean;
    bodyParser?: BodyParser;
    cors?: Cors;
    naming: boolean;
    'profiles.active'?: string;
}
export interface YamlConfigSchema {
    application: ConfigSchema;
}
export type env = 'dev' | 'test' | 'pre' | 'online';
interface Documnet {
    name: string;
    describe: string;
    version: number;
}
interface BodyParser {
    urlencoded: any;
    text: any;
    raw: any;
    json: any;
}
interface Cors {
    address: string;
    enable: boolean;
}
interface Mysql {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    timeout: number;
    logging: boolean;
}
interface Redis {
    host: string;
    port: number;
    db: string;
    password: string;
}
interface Logger {
    level: LogLevel;
    errorLogName: string;
}
declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    LOG = "log",
    VERBOSE = "verbose",
    DEBUG = "debug"
}
export interface EnvConfig {
    host: string;
    port: number;
    name: string;
    serverPath: string;
    env: env;
    docs: Documnet;
    cors: Cors;
    innerServer: string;
    ipIntercept: boolean;
}
export interface CoverConfig {
    env: env;
    mysql: Mysql;
}
export {};
//# sourceMappingURL=config.schema.interface.d.ts.map