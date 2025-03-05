import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SingleService } from '@cs/nest-typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService extends SingleService<User> {
  constructor(
    @InjectRepository(User, 'test')
    private userRepository: Repository<User>,
    // private dataSource: DataSource,
  ) {
    super(userRepository);
  }

  // 创建用户
  async createUser(userData: Partial<User>): Promise<number> {
    const user = this.userRepository.create({
      ...userData,
    });
    return this.saveOne(user);
  }

  // 查找用户并过滤掉已删除的
  async findActiveUsers(): Promise<User[]> {
    return this.findMany({ isRemoved: false });
  }

  // 用户登录检查
  async checkUserCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findOne({
      username,
      password,
      isEnable: true,
      isRemoved: false,
    });
    return user;
  }

  // 禁用用户
  async disableUser(userId: string): Promise<number> {
    return this.updateByCondition({ isEnable: false }, { id: userId });
  }

  // 软删除用户
  async deleteUser(userId: string): Promise<number> {
    return this.hardDelete({ id: userId });
  }

  // 查找活跃用户（通过原生SQL）
  async findActiveUsersBySQL(): Promise<any[]> {
    return this.executeSql(
      `SELECT * FROM sys_user WHERE is_enable = :isEnable AND is_removed = :isRemoved ORDER BY created_at DESC LIMIT 10`,
      { isEnable: true, isRemoved: false },
    );
  }

  // 事务示例：创建多个用户
  async createMultipleUsers(usersData: Partial<User>[]): Promise<number> {
    return await this.saveMany(usersData);
  }
}
