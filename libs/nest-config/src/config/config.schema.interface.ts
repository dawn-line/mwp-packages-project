import { ModuleMetadata } from '@nestjs/common';

export type ConfigFrom = 'gitea' | 'nacos';
export interface ConfigOptions {
  configFilePath?: string; // 本地配置地址
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

// 文档配置
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
// Cors配置
interface Cors {
  address: string;
  enable: boolean;
}

// mysql配置
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

// redis配置
interface Redis {
  host: string;
  port: number;
  db: string;
  password: string;
}

// 日志配置
interface Logger {
  // 日志等级由高到低 error/warn/log/verbose/debug
  level: LogLevel;
  errorLogName: string;
}

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
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
