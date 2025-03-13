import {
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { QueryConditionInput, PageResult, CommonUtil } from '@cs/nest-common';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  /**
   * 根据条件对象查询符合条件的一个对象
   * @param dto 条件的dto对象
   * @returns 查询到的对象
   */
  async findOne(dto: Partial<T>): Promise<T> {
    const options: FindOneOptions<T> = {
      where: dto as FindOptionsWhere<T>,
    };
    return super.findOne(options);
  }

  /**
   * 根据条件对象查询符合条件的多个对象
   * @param dto 条件的dto对象
   * @returns 查询到的对象数组
   */
  async findMany(dto: Partial<T>, take?: number, skip?: number): Promise<T[]> {
    return super.find({
      where: dto as FindOptionsWhere<T>,
      take,
      skip,
    });
  }

  /**
   * 根据条件对象查询符合条件的多个对象
   * @param queryConditionInput 查询的条件对象
   * @returns 查询的结果集
   */
  async findManyBase<R>(
    queryConditionInput: QueryConditionInput,
  ): Promise<R[] | PageResult<R[]>> {
    // 创建基本查询构建器
    const queryBuilder = this.createQueryBuilder(queryConditionInput.tableName);

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
      } as PageResult<R[]>;
    } else {
      // 非分页查询
      const result = await queryBuilder.getMany();
      return result as any;
    }
  }

  /**
   * 添加或修改单条对象，根据主键判断是新增还是修改
   * @param entity 要添加或修改的对象
   * @returns 处理结果影响条目数
   */
  async saveOne(entity: DeepPartial<T>): Promise<number> {
    const entityDto = this.create(entity);
    const result = await this.save(entityDto, {
      transaction: false, // 禁用事务
    });
    return result ? 1 : 0;
  }

  /**
   * 添加或修改多条对象，根据主键判断是新增还是修改
   * @param entities 要添加或修改的对象数组
   * @returns 处理结果影响条目数
   */
  async saveMany(entities: DeepPartial<T>[]): Promise<number> {
    const entityDtos = entities.map((entity) => this.create(entity));
    const result = await this.save(entityDtos);
    return result.length;
  }

  /**
   * 根据传递条件对数据修改
   * @param updateData 修改的数据对象
   * @param conditions 查找条件的数据对象
   * @returns 处理结果影响条目数
   */
  async updateByCondition(
    updateData: Partial<T>,
    conditions: Partial<T>,
  ): Promise<number> {
    (updateData as any).version = Date.now();
    const result = await this.update(
      conditions as FindOptionsWhere<T>,
      updateData as any,
    );
    return result.affected || 0;
  }

  /**
   * 根据条件对象软删一个或者多个对象（设置isRemoved=true）
   * @param conditions 条件对象
   * @returns 处理结果影响条目数
   */
  async softDelete(conditions: Partial<T>): Promise<UpdateResult> {
    const result = await this.update(
      conditions as FindOptionsWhere<T>,
      { isRemoved: true, version: Date.now() } as any,
    );
    return result;
  }

  /**
   * 根据条件对象真删一个或者多个对象
   * @param conditions 条件对象
   * @returns 处理结果影响条目数
   */
  async hardDelete(conditions: Partial<T>): Promise<number> {
    const result = await this.delete(conditions as FindOptionsWhere<T>);
    return result.affected || 0;
  }

  /**
   * 执行自由SQL语句
   * @param sql 执行的SQL语句
   * @param parameters SQL语句中的参数
   * @returns 处理结果影响条目数或查询结果
   */
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
      const records = await this.query(processedSql, paramValues);

      if (Array.isArray(records)) {
        CommonUtil.transRecords(records);
      }

      return records;
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
