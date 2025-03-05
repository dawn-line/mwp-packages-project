import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRegisteredEntities } from './entity.registry';
import {
  DatabaseModuleOptions,
  DatabaseModuleAsyncOptions,
  EntityRegistration,
} from './database.types';
import { createDatabaseProviders } from './database.providers';
import { DATABASE_MODULE_OPTIONS } from './database.constants';

@Injectable()
class DatabaseConnectionInitializer implements OnModuleInit {
  constructor(
    @Inject(DATABASE_MODULE_OPTIONS) private options: DatabaseModuleOptions,
  ) {}

  async onModuleInit() {
    // 跳过第一个连接，它会在模块导入阶段通过TypeOrmModule.forRootAsync处理
    if (!this.options?.connections || this.options.connections.length <= 1) {
      return;
    }

    // 从第二个连接开始创建额外的连接
    for (let i = 1; i < this.options.connections.length; i++) {
      const connection = this.options.connections[i];
      const registeredEntities = getRegisteredEntities(connection.name);
      console.log(`创建额外的数据库连接: ${connection.name}, 实体数量: ${registeredEntities.length}`);
      try {
        await createConnection({
          ...connection,
          name: connection.name,
          entities: [...registeredEntities],
        });
        console.log(`数据库连接 ${connection.name} 创建成功`);
      } catch (error) {
        console.error(`创建数据库连接 ${connection.name} 失败:`, error);
      }
    }
  }
}

@Module({})
export class DatabaseModule {
  /**
   * 配置多数据库连接（同步方式）
   */
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const connections = options.connections.map((connection) => {
      const registeredEntities = getRegisteredEntities(connection.name);
      return TypeOrmModule.forRoot({
        ...connection,
        name: connection.name,
        entities: [...registeredEntities],
      });
    });
    return {
      module: DatabaseModule,
      imports: [...connections],
      global: true,
    };
  }

  /**
   * 配置多数据库连接（异步方式）
   */

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    // 创建数据库配置提供者
    const databaseOptionsProvider = {
      provide: DATABASE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    return {
      module: DatabaseModule,
      imports: [
        ...(options.imports || []),
        // 只导入第一个连接，其余连接将在应用启动时动态创建
        TypeOrmModule.forRootAsync({
          imports: options.imports,
          inject: [DATABASE_MODULE_OPTIONS],
          useFactory: async (dbOptions: DatabaseModuleOptions) => {
            if (!dbOptions?.connections || dbOptions.connections.length === 0) {
              throw new Error('未提供数据库连接配置');
            }

            // 返回第一个连接的配置
            const firstConnection = dbOptions.connections[0];
            const entities = getRegisteredEntities(firstConnection.name);
            // console.log(
            //   `配置主数据库连接: ${firstConnection.name}, 实体数量: ${entities.length}`,
            // );

            return {
              ...firstConnection,
              entities: [...entities],
            };
          },
        }),
      ],
      providers: [
        asyncOptionsProvider,
        DatabaseConnectionInitializer, // 用于创建额外连接的服务
      ],
      global: true,
    };
  }

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
