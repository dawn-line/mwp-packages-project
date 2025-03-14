import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ModuleMetadata } from '@nestjs/common';
export interface EntityClassOrSchema {
  new (...args: any[]): any;
}

export interface DatabaseModuleOption extends MysqlConnectionOptions {
  name?: string;
}

export type DatabaseModuleOptions = Record<string, DatabaseModuleOption>;

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

/**
 * 数据源管理器接口
 */
export interface DataSourceManager {
  /**
   * 获取指定名称的数据源
   * @param name 数据源名称
   */
  getDataSource(name?: string): DataSource;

  /**
   * 获取所有数据源
   */
  getAllDataSources(): Map<string, DataSource>;
}
