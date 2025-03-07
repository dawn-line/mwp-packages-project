import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getRegisteredEntities } from './entity.registry';
import { DataSource } from 'typeorm';
import {
  DatabaseModuleOptions,
  DatabaseModuleAsyncOptions,
  EntityRegistration,
} from './database.types';
import { DBService } from './database.service';
import {
  DATABASE_MODULE_OPTIONS,
  DATABASE_CONNECTIONS,
  DEFAULT_CONNECTION_NAME,
} from './database.constants';

@Module({})
export class DatabaseModule {
  /**
   * 配置多数据库连接（同步方式）
   */
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const connections = [];
    for (const key in options) {
      const element = options[key];
      const registeredEntities = getRegisteredEntities(element.name);
      // console.log(
      //   `为连接 ${connection.name} 注册实体，数量: ${registeredEntities.length}`,
      // );
      connections.push(
        TypeOrmModule.forRoot({
          ...element,
          name: element.name,
          entities: [...registeredEntities],
        }),
      );
    }

    return {
      module: DatabaseModule,
      imports: [...connections],
      global: true,
    };
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ...(options.imports || []),
        TypeOrmModule.forRootAsync({
          inject: options.inject,
          useFactory: async (...args: any[]) => {
            const dbOptions = await options.useFactory(...args);
            const registeredEntities = getRegisteredEntities();
            return {
              ...dbOptions,
              entities: [...registeredEntities],
            };
          },
        }),
      ],
      providers: [
        {
          provide: DATABASE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        DBService,
      ],
      exports: [DBService],
      global: true,
    };
  }

  /**
   * 配置多数据库连接（异步方式）
   * 使用多个TypeOrmModule.forRootAsync配置，确保每个连接都在NestJS初始化阶段创建
   */
  // static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
  //   const connectionProvider = this.createAysncProvider();
  //   return {
  //     module: DatabaseModule,
  //     imports: options.imports ?? [],
  //     global: true,
  //     providers: [
  //       {
  //         provide: DATABASE_MODULE_OPTIONS,
  //         useFactory: options.useFactory,
  //         inject: options.inject,
  //       },
  //       DBService,
  //       connectionProvider,
  //     ],
  //     exports: [DBService, DATABASE_MODULE_OPTIONS],
  //   };
  // }

  // private static createAysncProvider(): Provider {
  //   // create client
  //   return {
  //     provide: DATABASE_CONNECTIONS,
  //     useFactory: async (
  //       options: DatabaseModuleOptions,
  //     ): Promise<Map<string, DataSource>> => {
  //       const connections = new Map<string, DataSource>();
  //       for (const key in options) {
  //         const element = options[key];
  //         const registeredEntities = getRegisteredEntities(element.name);
  //         const name = key || DEFAULT_CONNECTION_NAME;
  //         if (connections.has(name)) {
  //           throw new Error(`数据库初始化错误: 连接名称 "${name}" 必须唯一`);
  //         }
  //         // 创建TypeORM配置
  //         const typeOrmOptions: TypeOrmModuleOptions = {
  //           ...element,
  //           name: key,
  //           entities: [...registeredEntities],
  //         };
  //         TypeOrmModule.forRoot(typeOrmOptions);
  //         // 获取DataSource实例并存储在Map中
  //         const dataSource = new DataSource(typeOrmOptions as any);
  //         try {
  //           await dataSource.initialize();
  //           console.log(`数据库连接 "${name}" 初始化成功`);
  //           connections.set(name, dataSource);
  //         } catch (error) {
  //           console.error(`数据库连接 "${name}" 初始化失败:`, error);
  //           throw error;
  //         }
  //       }
  //       return connections;
  //     },
  //     inject: [DATABASE_MODULE_OPTIONS],
  //   };
  // }

  /**
   * 注册实体（支持一次注入多个实体）
   */
  static forFeature(registration: EntityRegistration): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forFeature(
          registration.entities,
          registration.connectionName,
        ),
      ],
      exports: [
        TypeOrmModule.forFeature(
          registration.entities,
          registration.connectionName,
        ),
      ],
    };
  }

  /**
   * 批量注册实体到不同连接（增强的多实体注册）
   */
  static forFeatures(registrations: EntityRegistration[]): DynamicModule {
    const imports = [];
    const exports = [];

    registrations.forEach((registration) => {
      const typeOrmFeatureModule = TypeOrmModule.forFeature(
        registration.entities,
        registration.connectionName,
      );

      imports.push(typeOrmFeatureModule);
      exports.push(typeOrmFeatureModule);
    });

    return {
      module: DatabaseModule,
      imports,
      exports,
    };
  }
}
