import { Repository } from 'typeorm';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { QueryConditionInput, PageResult } from '../dto';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { CommonUtil } from '../utils';
import { isEmpty } from 'lodash';

@Injectable()
export abstract class SingleService<Entity, Dto> {
  constructor(private readonly singleRepository: Repository<Entity>) {}
  private defaultCtxParams = {
    user: {
      userId: '0000000000000000000000',
      realName: '系统用户',
    },
  };

  async getOneBase(entitiesDto: any): Promise<any> {
    try {
      return await this.singleRepository.findOne({
        where: entitiesDto,
      });
    } catch (error) {
      throw new HttpException('请求异常', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findManyBase(entitiesDto: any): Promise<any> {
    try {
      return await this.singleRepository.find({
        where: entitiesDto,
      });
    } catch (error) {
      throw new HttpException('请求异常', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getManyBase(
    queryConditionInput: QueryConditionInput,
  ): Promise<any[] | PageResult<any[]>> {
    // 是否为分页结构
    if (queryConditionInput.skip !== undefined) {
      const result = await this.singleRepository
        .createQueryBuilder(queryConditionInput.tableName)
        .select(queryConditionInput.select)
        .where(
          queryConditionInput.conditionLambda,
          queryConditionInput.conditionValue,
        )
        .orderBy(queryConditionInput.orderBy)
        .skip(queryConditionInput.skip)
        .take(queryConditionInput.take)
        .getManyAndCount();
      const pageResult: PageResult<Entity[]> = {
        result: result[0],
        count: result[1],
      };
      return pageResult;
    } else {
      const result = await this.singleRepository
        .createQueryBuilder(queryConditionInput.tableName)
        .select(queryConditionInput.select)
        .where(
          queryConditionInput.conditionLambda,
          queryConditionInput.conditionValue,
        )
        .orderBy(queryConditionInput.orderBy)
        .take(queryConditionInput.take)
        .getMany();
      return result;
    }
  }

  // 添加单条对象
  async createOneBase(
    entityDto: any,
    ctxParams: any = {},
    options: SaveOptions = { reload: false, transaction: false },
  ): Promise<any> {
    // 对数据进行处理（生成主键，添加系统数据）
    ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
    if (typeof entityDto === 'object' && !Array.isArray(entityDto)) {
      if (!entityDto.id) {
        entityDto.id = CommonUtil.idGenerate();
      }
      // 添加其他属性
      entityDto.creatorId = ctxParams.user.userId;
      entityDto.creatorName = ctxParams.user.realName;
      entityDto.modifierId = ctxParams.user.userId;
      entityDto.modifierName = ctxParams.user.realName;
      entityDto.version = CommonUtil.getVerSion();
      return await this.singleRepository.save(entityDto, options);
    } else {
      throw new HttpException('参数类型错误！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 修改单条对象
  async updateOneBase(
    entityDto: any,
    ctxParams: any = {},
    options: SaveOptions = { reload: false, transaction: false },
  ): Promise<any> {
    ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
    if (typeof entityDto === 'object' && !Array.isArray(entityDto)) {
      entityDto.modifierId = ctxParams.user.userId;
      entityDto.modifierName = ctxParams.user.realName;
      entityDto.version = CommonUtil.getVerSion();
      return await this.singleRepository.save(entityDto, options);
    } else {
      throw new HttpException('参数类型错误！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 根据条件修改
  async updateByCondition(
    entityDto: any,
    findEntityDto: any,
    ctxParams: any = {},
  ): Promise<any> {
    ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
    try {
      entityDto.modifierId = ctxParams.user.userId;
      entityDto.modifierName = ctxParams.user.realName;
      entityDto.version = CommonUtil.getVerSion();
      return await this.singleRepository.update(findEntityDto, entityDto);
    } catch (error) {
      throw new HttpException('参数类型错误！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 添加或修改多条对象
  async saveManyBase(
    entitiesDto: any[],
    ctxParams: any = {},
    options: SaveOptions = { reload: false, transaction: true },
  ): Promise<any> {
    ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
    // 添加默认
    const type = typeof entitiesDto;
    if (type === 'object' && Array.isArray(entitiesDto)) {
      entitiesDto.map((item) => {
        if (!item.id) {
          item.id = CommonUtil.idGenerate();
          // 添加新增信息
          item.creatorId = ctxParams.user.userId;
          item.creatorName = ctxParams.user.realName;
        }
        item.modifierId = ctxParams.user.userId;
        item.modifierName = ctxParams.user.realName;
        item.version = CommonUtil.getVerSion();
      });
      return await this.singleRepository.save(entitiesDto, options);
    } else {
      throw new HttpException('参数类型错误！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 软删一个或者多个对象
  async deleteBase(
    entitiesDto: any,
    ctxParams: any = {},
    options: SaveOptions = { reload: false, transaction: false },
  ): Promise<any> {
    ctxParams = Object.assign(this.defaultCtxParams, ctxParams);
    // 添加默认
    try {
      if (entitiesDto.length > 0) {
        entitiesDto.map((item) => {
          if (!item.id) {
            throw new HttpException('缺少主键id', HttpStatus.INTERNAL_SERVER_ERROR);
          }
          item.isRemoved = true;
          item.modifierId = ctxParams.user.userId;
          item.modifierName = ctxParams.user.realName;
          item.version = CommonUtil.getVerSion();
        });
      } else {
        if (!entitiesDto.id) {
          throw new HttpException('缺少主键id', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        entitiesDto.isRemoved = true;
        entitiesDto.modifierId = ctxParams.user.userId;
        entitiesDto.modifierName = ctxParams.user.realName;
        entitiesDto.version = CommonUtil.getVerSion();
      }
      return await this.singleRepository.save(entitiesDto, options);
    } catch (error) {
      throw new HttpException('参数类型错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 销毁一个或多个对象
  async destoryBase(
    entitiesDto: any,
    options: SaveOptions = { reload: false, transaction: false },
  ): Promise<any> {
    try {
      return await this.singleRepository.remove(entitiesDto, options);
    } catch (error) {
      throw new HttpException('参数类型错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 执行自由sql语句
  async execute(querysql: string, parameters?: object): Promise<any> {
    const arrParams: (string | number)[] = [];
    if (!isEmpty(parameters)) {
      const r = /\:\w+/g;
      const replaceWords = querysql.match(r);
      if (replaceWords) {
        querysql = querysql.replace(r, '?');
        replaceWords.forEach((i) => {
          const arrtName = i.split(':')[1];
          arrParams.push(parameters[arrtName]);
        });
      }
    }
    const records = await this.singleRepository.query(querysql, arrParams);
    if (Array.isArray(records)) {
      CommonUtil.transRecords(records);
    }
    return records;
  }
}
