import { BaseRepository } from '@cs/nest-typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户实体
   */
  async findByUsername(username: string): Promise<UserEntity> {
    return this.findOne({ username });
  }

  /**
   * 更新用户状态
   * @param id 用户ID
   * @param status 用户状态
   * @returns 影响行数
   */
  async updateStatus(id: string, status: number): Promise<number> {
    return this.updateByCondition({ status }, { id });
  }

  /**
   * 验证用户账号密码
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息或null
   */
  async validateUser(username: string, password: string): Promise<UserEntity> {
    return this.findOne({ username, password, isRemoved: false });
  }

  /**
   * 获取部门下的所有用户
   * @param deptId 部门ID
   * @returns 用户列表
   */
  async findByDeptId(deptId: string): Promise<UserEntity[]> {
    return this.findMany({ deptId, isRemoved: false });
  }

  /**
   * 检查用户名是否已存在
   * @param username 用户名
   * @returns 用户名是否存在
   */
  async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.findOne({ username });
    return !!user;
  }

  /**
   * 复杂查询示例：分页查询用户列表（模糊查询）
   * @param params 查询参数
   * @returns 查询结果
   */
  async searchUsers(params: {
    keyword?: string;
    status?: number;
    deptId?: string;
    pageNum?: number;
    pageSize?: number;
  }) {
    const { keyword, status, deptId, pageNum = 1, pageSize = 10 } = params;

    // 构建查询条件
    let conditionLambda = 'u.isRemoved = :isRemoved';
    const conditionValue: Record<string, any> = { isRemoved: false };

    if (keyword) {
      conditionLambda +=
        ' AND (u.username LIKE :keyword OR u.realName LIKE :keyword OR u.mobile LIKE :keyword)';
      conditionValue.keyword = `%${keyword}%`;
    }

    if (status !== undefined) {
      conditionLambda += ' AND u.status = :status';
      conditionValue.status = status;
    }

    if (deptId) {
      conditionLambda += ' AND u.deptId = :deptId';
      conditionValue.deptId = deptId;
    }

    // 使用findManyBase方法执行查询
    return this.findManyBase({
      tableName: 'u',
      select: [
        'u.id',
        'u.username',
        'u.realName',
        'u.email',
        'u.mobile',
        'u.avatar',
        'u.status',
        'u.deptId',
        'u.lastLoginTime',
        'u.createdAt',
        'u.creatorName',
      ],
      conditionLambda,
      conditionValue,
      orderBy: { 'u.createdAt': 'DESC' },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
    });
  }
}
