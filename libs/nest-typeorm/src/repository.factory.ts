import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Type } from '@nestjs/common';

/**
 * 仓储工厂，用于创建自定义仓储实例
 */
export class RepositoryFactory {
  /**
   * 为指定实体创建自定义仓储
   * @param dataSource 数据源
   * @param entity 实体类
   * @param customRepositoryClass 自定义仓储类，必须继承自BaseRepository
   */
  static create<T extends ObjectLiteral, R extends BaseRepository<T>>(
    dataSource: DataSource,
    entity: EntityTarget<T>,
    customRepositoryClass: Type<R>,
  ): R {
    // 获取实体的元数据
    const entityMetadata = dataSource.getMetadata(entity);

    // 创建自定义仓储实例
    const repository = new customRepositoryClass();

    // 使用TypeORM内部的方式初始化仓储
    // TypeORM 0.3.x中的Repository方法
    // 我们在这里尝试使用dataSource.getRepository来创建基础仓储
    // 然后复制其内部状态到我们的自定义仓储
    const baseRepository = dataSource.getRepository(entity);

    // 复制属性
    Object.keys(baseRepository).forEach((key) => {
      if (key !== 'constructor' && key !== 'metadata') {
        (repository as any)[key] = (baseRepository as any)[key];
      }
    });

    // 复制原型链上的方法
    const baseProto = Object.getPrototypeOf(baseRepository);
    const repoProto = Object.getPrototypeOf(repository);

    Object.getOwnPropertyNames(baseProto).forEach((method) => {
      if (
        method !== 'constructor' &&
        method !== 'metadata' &&
        typeof baseProto[method] === 'function' &&
        !(method in repoProto)
      ) {
        repoProto[method] = baseProto[method];
      }
    });

    // 确保查询运行器是可用的
    (repository as any).queryRunner = dataSource.createQueryRunner();

    return repository;
  }
}
