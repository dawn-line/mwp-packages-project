import { Injectable } from '@nestjs/common';
import { InjectRepository, BaseRepository } from '@cs/nest-typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleEntity } from './role.entity';
@Injectable()
export class UserService {
  @InjectRepository({
    entity: UserEntity,
    repository: UserRepository,
    connectionName: 'test',
  })
  private readonly userRepository: UserRepository;
  // 使用 undefined 作为第二个参数，使用默认仓库类
  @InjectRepository({
    entity: ProductEntity,
    connectionName: 'test',
  })
  private readonly productRepository: BaseRepository<ProductEntity>;

  // 使用对象参数版本的装饰器
  @InjectRepository({
    entity: RoleEntity,
    connectionName: 'test1',
  })
  private readonly roleRepository: BaseRepository<RoleEntity>;
  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建结果
   */
  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    // 检查用户名是否已存在
    const exists = await this.userRepository.isUsernameExists(
      userData.username,
    );
    if (exists) {
      throw new Error(`用户名 ${userData.username} 已存在`);
    }

    // 创建用户实体并保存
    const user = new UserEntity();
    Object.assign(user, userData);

    // 设置默认值
    user.id = Date.now().toString(); // 简单示例，实际应使用UUID或雪花ID
    user.isRemoved = false;

    // 插入产品
    const product = new ProductEntity();
    product.productname = 'test2111111';
    product.productcode = 'aaaaww22a';
    product.id = Date.now().toString();

    // 插入角色
    const role = new RoleEntity();
    role.rolename = 'tes11wwt';
    role.rolecode = 'aaa11wwaa';
    role.id = Date.now().toString();

    await this.userRepository.saveOne(user);
    await this.productRepository.saveOne(product);
    await this.roleRepository.saveOne(role);
    return user;
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户信息
   */
  async getUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id, isRemoved: false });
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param userData 用户数据
   * @returns 影响行数
   */
  async updateUser(id: string, userData: Partial<UserEntity>): Promise<number> {
    // 如果要更新用户名，先检查是否存在
    if (userData.username) {
      const existingUser = await this.userRepository.findOne({
        username: userData.username,
        isRemoved: false,
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error(`用户名 ${userData.username} 已被其他用户使用`);
      }
    }

    return this.userRepository.updateByCondition(userData, {
      id,
      isRemoved: false,
    });
  }

  /**
   * 删除用户（软删除）
   * @param id 用户ID
   * @returns 影响行数
   */
  async deleteUser(id: string): Promise<number> {
    return this.userRepository.softDeletion({ id });
  }

  /**
   * 彻底删除用户（物理删除）
   * @param id 用户ID
   * @returns 影响行数
   */
  async hardDeleteUser(id: string): Promise<number> {
    return this.userRepository.hardDelete({ id });
  }

  /**
   * 更新用户状态
   * @param id 用户ID
   * @param status 状态值
   * @returns 影响行数
   */
  async updateUserStatus(id: string, status: number): Promise<number> {
    return this.userRepository.updateStatus(id, status);
  }

  /**
   * 搜索用户列表
   * @param params 搜索参数
   * @returns 分页用户列表
   */
  async searchUsers(params: {
    keyword?: string;
    status?: number;
    deptId?: string;
    pageNum?: number;
    pageSize?: number;
  }) {
    return this.userRepository.searchUsers(params);
  }

  /**
   * 用户登录验证
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息或null
   */
  async validateUser(username: string, password: string): Promise<UserEntity> {
    // 实际项目中应加密密码后再比较
    const user = await this.userRepository.validateUser(username, password);

    // 更新最后登录时间
    if (user) {
      await this.userRepository.updateByCondition(
        { lastLoginTime: new Date() },
        { id: user.id },
      );
    }

    return user;
  }

  /**
   * 获取部门下的所有用户
   * @param deptId 部门ID
   * @returns 用户列表
   */
  async getUsersByDeptId(deptId: string): Promise<UserEntity[]> {
    return this.userRepository.findByDeptId(deptId);
  }

  /**
   * 执行自定义SQL示例
   * @param keyword 关键字
   * @returns SQL执行结果
   */
  async executeCustomQuery(keyword: string): Promise<any> {
    const sql = `
      SELECT u.id, u.username, u.real_name as realName, u.email, u.mobile, u.status
      FROM sys_user u
      WHERE u.is_removed = 0
        AND (u.username LIKE :keyword OR u.real_name LIKE :keyword)
      ORDER BY u.created_at DESC
      LIMIT 20
    `;

    return this.userRepository.executeSql(sql, {
      keyword: `%${keyword}%`,
    });
  }
}
