import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { DATA_SOURCE_MANAGER } from '@cs/nest-typeorm';
import { Inject } from '@nestjs/common';
import { DataSourceManager, BaseRepository } from '@cs/nest-typeorm';
import { InjectDataSourceManager } from '../decorators';

/**
 * 用户仓库 - 使用委托方式而不是继承方式实现
 */
@Injectable()
export class UserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(
    // 注入数据源管理器
    @InjectDataSourceManager()
    private readonly dataSourceManager: DataSourceManager,
  ) {
    // 使用默认数据源获取标准仓库实例
    const dataSource = this.dataSourceManager.getDataSource('test');
    this.repository = dataSource.getRepository(UserEntity);
  }

  // 基本查询方法
  async findOne(conditions: Partial<UserEntity>): Promise<UserEntity> {
    return this.repository.findOne({ where: conditions });
  }

  async findMany(
    conditions: Partial<UserEntity>,
    take?: number,
    skip?: number,
  ): Promise<UserEntity[]> {
    return this.repository.find({
      where: conditions,
      take,
      skip,
    });
  }

  // 实体保存方法
  async saveOne(entity: Partial<UserEntity>): Promise<number> {
    const entityDto = this.repository.create(entity);
    const result = await this.repository.save(entityDto, {
      transaction: false, // 禁用事务
    });
    return result ? 1 : 0;
  }

  async saveMany(entities: Partial<UserEntity>[]): Promise<number> {
    const entityDtos = entities.map((entity) => this.repository.create(entity));
    const result = await this.repository.save(entityDtos);
    return result.length;
  }

  // 更新方法
  async updateByCondition(
    updateData: Partial<UserEntity>,
    conditions: Partial<UserEntity>,
  ): Promise<number> {
    (updateData as any).version = Date.now();
    const result = await this.repository.update(conditions, updateData);
    return result.affected || 0;
  }

  // 软删除与硬删除
  async softDelete(conditions: Partial<UserEntity>): Promise<any> {
    const result = await this.repository.update(conditions, {
      isRemoved: true,
      version: Date.now(),
    } as any);
    return result;
  }

  async hardDelete(conditions: Partial<UserEntity>): Promise<number> {
    const result = await this.repository.delete(conditions);
    return result.affected || 0;
  }

  // 自定义查询方法
  async findByUsername(username: string): Promise<UserEntity> {
    return this.findOne({ username });
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    return this.findMany({ status: 1, isRemoved: false });
  }

  // 高级查询与SQL执行
  async findManyBase<R>(queryConditionInput: any): Promise<R[] | any> {
    // 创建基本查询构建器
    const queryBuilder = this.repository.createQueryBuilder(
      queryConditionInput.tableName,
    );

    // 添加选择的字段
    if (queryConditionInput.select) {
      queryBuilder.select(queryConditionInput.select);
    }

    // 添加条件
    if (queryConditionInput.conditionLambda) {
      queryBuilder.where(
        queryConditionInput.conditionLambda,
        queryConditionInput.conditionValue || {},
      );
    }

    // 添加排序
    if (queryConditionInput.orderBy) {
      queryBuilder.orderBy(queryConditionInput.orderBy);
    }

    // 添加限制数量
    if (queryConditionInput.take !== undefined) {
      queryBuilder.take(queryConditionInput.take);
    }

    // 判断是否需要分页
    if (queryConditionInput.skip !== undefined) {
      // 分页查询
      queryBuilder.skip(queryConditionInput.skip);

      // 使用countQuery缓存计数查询，避免重复执行相同条件的查询
      const [result, count] = await queryBuilder.getManyAndCount();

      return {
        result: result as any,
        count,
      };
    } else {
      // 非分页查询
      const result = await queryBuilder.getMany();
      return result as any;
    }
  }

  async executeSql(
    querySql: string,
    parameters?: Record<string, any>,
  ): Promise<any> {
    try {
      // 参数处理
      let processedSql = querySql;
      const paramValues: any[] = [];

      if (parameters && Object.keys(parameters).length > 0) {
        const namedParamRegex = /\:(\w+)/g;
        const matches = [...querySql.matchAll(namedParamRegex)];

        if (matches.length > 0) {
          // 收集所有参数名
          const paramNames = matches.map((match) => match[1]);

          // 替换SQL中的命名参数为问号占位符
          processedSql = querySql.replace(namedParamRegex, '?');

          // 按顺序提取参数值
          paramNames.forEach((name) => {
            if (name in parameters) {
              paramValues.push(parameters[name]);
            } else {
              throw new Error(`缺少SQL参数: ${name}`);
            }
          });
        }
      }

      // 执行查询
      return this.repository.query(processedSql, paramValues);
    } catch (error) {
      // 错误处理
      console.error(`SQL执行错误: ${error.message}`, {
        sql: querySql,
        params: parameters,
      });
      throw error;
    }
  }
}
