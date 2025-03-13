import { DataSource, EntityTarget } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ModuleMetadata, Type } from '@nestjs/common';
import { BaseRepository } from './base.repository';
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

  /**
   * 为指定实体和数据源创建自定义仓储
   * @param entity 实体类
   * @param customRepositoryClass 自定义仓储类
   * @param connectionName 连接名称
   */
  getCustomRepository<T, R extends BaseRepository<T>>(
    entity: EntityTarget<T>,
    customRepositoryClass: Type<R>,
    connectionName?: string,
  ): R;
}
