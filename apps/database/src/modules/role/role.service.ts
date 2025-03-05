import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SingleService } from '@cs/nest-typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends SingleService<Role> {
  constructor(
    @InjectRepository(Role, 'test1')
    private roleRepository: Repository<Role>,
    // private dataSource: DataSource,
  ) {
    super(roleRepository);
  }

  // 创建角色
  async createRole(roleData: Partial<Role>): Promise<number> {
    const role = {
      ...roleData,
    };
    return this.saveOne(role);
  }

  // 查找所有启用的角色
  async findAllEnabledRoles(): Promise<Role[]> {
    return this.findMany({ isEnable: true, isRemoved: false });
  }

  // 根据角色编码查找角色
  async findRoleByCode(roleCode: string): Promise<Role> {
    return this.executeSql(
      `select * 
      from  test1.sys_role 
      where sys_role.role_code = :roleCode
      and sys_role.is_removed = false`,
      { roleCode },
    );
  }

  // 更新角色信息
  async updateRole(
    conditions: Partial<Role>,
    roleData: Partial<Role>,
  ): Promise<number> {
    return this.updateByCondition({ ...roleData }, conditions);
  }

  // 软删除角色
  async deleteRole(roleId: string): Promise<number> {
    return this.hardDelete({ id: roleId });
  }

  // 批量创建角色
  async batchCreateRoles(rolesData: Partial<Role>[]): Promise<number> {
    const roles = rolesData.map((roleData) => ({
      ...roleData,
    }));
    return this.saveMany(roles as Role[]);
  }
}
