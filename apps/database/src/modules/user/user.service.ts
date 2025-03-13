import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { QueryConditionInput } from '@cs/nest-common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 创建用户
  async create(user: Partial<UserEntity>): Promise<number> {
    // 生成唯一ID
    user.id = Date.now().toString();
    // 设置创建者信息
    user.creatorId = 'system';
    user.creatorName = 'System';
    return this.userRepository.saveOne(user);
  }

  // 批量创建用户
  async createMany(users: Partial<UserEntity>[]): Promise<number> {
    // 为每个用户设置ID和创建者信息
    users.forEach(user => {
      user.id = Date.now().toString() + Math.floor(Math.random() * 1000);
      user.creatorId = 'system';
      user.creatorName = 'System';
    });
    return this.userRepository.saveMany(users);
  }

  // 更新用户
  async update(id: string, userData: Partial<UserEntity>): Promise<number> {
    // 设置更新者信息
    userData.modifierId = 'system';
    userData.modifierName = 'System';
    return this.userRepository.updateByCondition(userData, { id });
  }

  // 软删除用户
  async softDelete(id: string): Promise<any> {
    return this.userRepository.softDelete({ id });
  }

  // 硬删除用户
  async hardDelete(id: string): Promise<number> {
    return this.userRepository.hardDelete({ id });
  }

  // 获取单个用户
  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id, isRemoved: false } });
  }

  // 获取用户列表
  async findAll(query?: Partial<UserEntity>): Promise<UserEntity[]> {
    const conditions = { ...query, isRemoved: false };
    return this.userRepository.find({ where: conditions });
  }

  // 分页查询用户
  async findWithPagination(page: number, size: number): Promise<any> {
    const queryCondition: QueryConditionInput = {
      tableName: 'user',
      conditionLambda: 'user.is_removed = :isRemoved',
      conditionValue: { isRemoved: false },
      orderBy: { 'user.created_at': 'DESC' },
      skip: (page - 1) * size,
      take: size,
    };

    return this.userRepository.findManyBase(queryCondition);
  }

  // 通过自定义SQL查询用户
  async findByCustomSql(status: number): Promise<any> {
    const sql = `
      SELECT * FROM user 
      WHERE status = :status AND is_removed = :isRemoved
    `;
    return this.userRepository.(sql, [status, false]);
  }
}
