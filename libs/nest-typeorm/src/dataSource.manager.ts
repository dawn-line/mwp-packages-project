import { Injectable, Type } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { DEFAULT_CONNECTION_NAME } from './database.constants';
import { RepositoryFactory } from './repository.factory';
import { DataSourceManager } from './database.types';
import { BaseRepository } from './base.repository';
/**
 * 数据源管理器实现类
 * 负责管理所有数据库连接
 */
@Injectable()
export class DataSourceManagerImpl implements DataSourceManager {
  /**
   * 存储所有数据源的映射表
   */
  private readonly dataSources: Map<string, DataSource> = new Map();

  /**
   * 构造函数
   * @param initialDataSources 初始数据源映射
   */
  constructor(initialDataSources?: Map<string, DataSource>) {
    if (initialDataSources) {
      this.dataSources = new Map(initialDataSources);
    }
  }

  /**
   * 获取指定名称的数据源
   * @param name 数据源名称，默认为 'default'
   * @throws 如果数据源不存在则抛出错误
   */
  getDataSource(name: string = DEFAULT_CONNECTION_NAME): DataSource {
    if (!this.dataSources.has(name)) {
      throw new Error(`数据源 "${name}" 不存在`);
    }
    return this.dataSources.get(name);
  }

  /**
   * 获取所有数据源
   */
  getAllDataSources(): Map<string, DataSource> {
    return this.dataSources;
  }

  /**
   * 注册数据源
   * @param name 数据源名称
   * @param dataSource 数据源实例
   * @throws 如果数据源名称已存在则抛出错误
   */
  registerDataSource(name: string, dataSource: DataSource): void {
    if (this.dataSources.has(name)) {
      throw new Error(`数据源名称 "${name}" 已存在`);
    }
    this.dataSources.set(name, dataSource);
  }

  /**
   * 为指定实体和数据源创建自定义仓储
   * @param entity 实体类
   * @param customRepositoryClass 自定义仓储类
   * @param connectionName 连接名称
   */
  getCustomRepository<T, R extends BaseRepository<T>>(
    entity: EntityTarget<T>,
    customRepositoryClass: Type<R>,
    connectionName: string = DEFAULT_CONNECTION_NAME,
  ): R {
    const dataSource = this.getDataSource(connectionName);
    return RepositoryFactory.create(dataSource, entity, customRepositoryClass);
  }
}
