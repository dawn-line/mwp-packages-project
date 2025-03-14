import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { DATABASE_CONNECTIONS } from '../database.constants';
import { DataSourceManagerImpl } from '../dataSource.manager';
import { BaseRepository, CustomRepository } from '../base.repository';
import { EntityTarget } from 'typeorm';
import {
  createRepositoryProvider,
  getRepositoryToken,
} from './inject-repository.decorator';

/**
 * 仓库注册信息
 */
export interface RepositoryRegistration<T, R extends BaseRepository<T>> {
  entity: EntityTarget<T>;
  repository?: Type<R>;
  connectionName?: string;
}

/**
 * 创建动态模块，注册指定的仓库
 * @param repositories 仓库注册信息列表
 */
export function createRepositoryModule(
  repositories: RepositoryRegistration<any, BaseRepository<any>>[],
): DynamicModule {
  const providers: Provider[] = [
    {
      provide: DataSourceManagerImpl,
      useFactory: (connections) => {
        return new DataSourceManagerImpl(connections);
      },
      inject: [DATABASE_CONNECTIONS],
    },
    ...repositories.map((reg) =>
      createRepositoryProvider({
        entity: reg.entity,
        repository: reg.repository,
        connectionName: reg.connectionName,
      }),
    ),
  ];

  const providerTokens = repositories.map((reg) => {
    // 如果未提供仓库类，则使用 CustomRepository
    const repoClass =
      reg.repository || (CustomRepository as unknown as Type<any>);
    return getRepositoryToken(reg.entity, repoClass);
  });
  return {
    module: RegistModule,
    providers,
    exports: [DataSourceManagerImpl, ...providerTokens],
  };
}

/**
 * 仓库动态模块
 * 用于动态注册仓库提供者
 */
@Module({})
export class RegistModule {
  /**
   * 静态方法，用于注册一组仓库
   * @param repositories 仓库注册信息列表
   */
  static forRepositories(
    repositories: RepositoryRegistration<any, BaseRepository<any>>[],
  ): DynamicModule {
    return createRepositoryModule(repositories);
  }
}
