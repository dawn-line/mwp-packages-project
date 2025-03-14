import { Inject, Type } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { BaseRepository, CustomRepository } from '../base.repository';
import { DEFAULT_CONNECTION_NAME } from '../database.constants';
import { DataSourceManagerImpl } from '../dataSource.manager';

/**
 * 仓库注入工厂标识符前缀
 */
export const REPOSITORY_FACTORY_TOKEN_PREFIX = 'REPOSITORY_FACTORY_';

/**
 * 生成特定实体和仓库类型的注入标识符
 * @param entity 实体类
 * @param repositoryClass 仓库类
 */
export function getRepositoryToken(
  entity: any,
  repositoryClass: Type<any>,
): string {
  // 获取实体的构造函数名称
  const entityName =
    entity.name || (entity.constructor ? entity.constructor.name : 'Unknown');
  return `${REPOSITORY_FACTORY_TOKEN_PREFIX}${entityName}_${repositoryClass.name}`;
}

/**
 * 创建仓库提供者的参数接口
 */
export interface CreateRepositoryProviderOptions<
  T,
  R extends BaseRepository<T>,
> {
  /** 实体类 */
  entity: EntityTarget<T>;
  /** 仓库类型，可选，默认为 CustomRepository */
  repository?: Type<R>;
  /** 数据库连接名称，默认为 'default' */
  connectionName?: string;
}

/**
 * 创建一个自定义仓库提供者
 */
export function createRepositoryProvider<T, R extends BaseRepository<T>>(
  options: CreateRepositoryProviderOptions<T, R>,
) {
  const entity = options.entity;
  const repositoryClass = options.repository;
  const connectionName = options.connectionName || DEFAULT_CONNECTION_NAME;
  // 如果未提供仓库类，则使用 CustomRepository 作为默认值
  const repoClass = repositoryClass || (CustomRepository as unknown as Type<R>);
  const token = getRepositoryToken(entity, repoClass);
  return {
    provide: token,
    useFactory: (dataSourceManager: DataSourceManagerImpl) => {
      return dataSourceManager.getCustomRepository(
        entity,
        repoClass,
        connectionName,
      );
    },
    inject: [DataSourceManagerImpl],
  };
}

/**
 * 注入仓库的参数接口
 */
export interface InjectRepositoryOptions<T, R extends BaseRepository<T>> {
  /** 实体类 */
  entity: EntityTarget<T>;
  /** 仓库类型，可选，默认为 CustomRepository */
  repository?: Type<R>;
  /** 数据库连接名称，默认为 'default' */
  connectionName?: string;
}

/**
 * 注入自定义仓库的装饰器
 */
export function InjectRepository<T, R extends BaseRepository<T>>(
  options: InjectRepositoryOptions<T, R>,
): PropertyDecorator {
  const entity: EntityTarget<T> = options.entity;
  let repositoryClass: Type<R> | undefined;
  let connectionName = DEFAULT_CONNECTION_NAME;
  connectionName = options.connectionName || DEFAULT_CONNECTION_NAME;
  // 如果未提供仓库类，则使用 CustomRepository 作为默认值
  const repoClass = repositoryClass || (CustomRepository as unknown as Type<R>);
  const token = getRepositoryToken(entity, repoClass);

  return (target: object, propertyKey: string | symbol) => {
    // 确保提供者已经存在
    Inject(token)(target, propertyKey);

    // 保存元数据，方便动态创建提供者
    Reflect.defineMetadata(
      'repository_info',
      { entity, repositoryClass: repoClass, connectionName },
      target.constructor,
      propertyKey,
    );
  };
}
