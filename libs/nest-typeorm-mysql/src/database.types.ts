import { Type } from '@nestjs/common';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface EntityClassOrSchema {
  new (...args: any[]): any;
}

export interface DatabaseConnectionOptions extends MysqlConnectionOptions {
  name: string;
}

export interface DatabaseModuleOptions {
  connections: DatabaseConnectionOptions[];
}

export interface EntityRegistration {
  connectionName: string;
  entities: EntityClassOrSchema[];
}

// 用于异步配置
export interface DatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
  inject?: any[];
}

export interface DatabaseOptionsFactory {
  createDatabaseOptions():
    | Promise<DatabaseModuleOptions>
    | DatabaseModuleOptions;
}
