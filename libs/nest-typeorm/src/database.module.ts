import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggerService } from '@cs/nest-common';
import {
  DatabaseModuleOptions,
  DatabaseModuleAsyncOptions,
} from './database.types';
import {
  DATABASE_MODULE_OPTIONS,
  DATABASE_CONNECTIONS,
  DATA_SOURCE_MANAGER,
} from './database.constants';
import { DataSourceManagerImpl } from './dataSource.manager';
import { getRegisteredEntities } from './entity.registry';
@Module({})
export class DatabaseModule {
  /**
   * 同步方式配置数据库连接
   * @param options 数据库连接配置
   */
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const connectionProvider = this.createConnectionProvider(options);
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_MODULE_OPTIONS,
          useValue: options,
        },
        connectionProvider,
        {
          provide: DATA_SOURCE_MANAGER,
          useFactory: (connections: Map<string, DataSource>) => {
            return new DataSourceManagerImpl(connections);
          },
          inject: [DATABASE_CONNECTIONS],
        },
      ],
      exports: [
        DATABASE_MODULE_OPTIONS,
        DATABASE_CONNECTIONS,
        DATA_SOURCE_MANAGER,
      ],
      global: true,
    };
  }

  /**
   * 异步方式配置数据库连接
   * @param options 异步配置选项
   */
  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: DATABASE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: DATABASE_CONNECTIONS,
          useFactory: async (dbOptions: DatabaseModuleOptions) => {
            // 创建配置的副本并注入实体
            const configWithEntities: DatabaseModuleOptions = {};
            for (const key in dbOptions) {
              // 创建新的配置对象
              configWithEntities[key] = {
                ...dbOptions[key],
                entities: getRegisteredEntities(key),
                name: key,
              };
            }
            return await this.createConnections(configWithEntities);
          },
          inject: [DATABASE_MODULE_OPTIONS],
        },
        {
          provide: DATA_SOURCE_MANAGER,
          useFactory: (connections: Map<string, DataSource>) => {
            return new DataSourceManagerImpl(connections);
          },
          inject: [DATABASE_CONNECTIONS],
        },
      ],
      exports: [
        DATABASE_MODULE_OPTIONS,
        DATABASE_CONNECTIONS,
        DATA_SOURCE_MANAGER,
      ],
      global: true,
    };
  }

  /**
   * 创建数据库连接提供者
   * @param options 数据库连接配置
   */
  private static createConnectionProvider(
    options: DatabaseModuleOptions,
  ): Provider {
    return {
      provide: DATABASE_CONNECTIONS,
      useFactory: async () => {
        // 创建配置的副本并注入实体
        const configWithEntities: DatabaseModuleOptions = {};
        for (const key in options) {
          // 创建新的配置对象
          configWithEntities[key] = {
            ...options[key],
            entities: getRegisteredEntities(key),
            name: key,
          };
        }
        return await this.createConnections(configWithEntities);
      },
    };
  }

  /**
   * 根据配置创建所有数据库连接
   * @param options 数据库连接配置
   */
  private static async createConnections(
    options: DatabaseModuleOptions,
  ): Promise<Map<string, DataSource>> {
    const connections = new Map<string, DataSource>();
    const logger = new LoggerService();
    for (const key in options) {
      const connectionOptions = options[key];
      const name = connectionOptions.name || key;

      if (connections.has(name)) {
        throw new Error(`数据库初始化错误: 连接名称 "${name}" 必须唯一`);
      }

      // 创建并初始化DataSource
      const dataSource = new DataSource(connectionOptions);
      try {
        await dataSource.initialize();
        logger.log(`数据库连接 "${name}" 初始化成功!`, 'DatabaseModule');
        connections.set(name, dataSource);
      } catch (error) {
        logger.error(
          `数据库连接 "${name}" 初始化失败${error}`,
          'DatabaseModule',
        );
        throw error;
      }
    }

    return connections;
  }
}
