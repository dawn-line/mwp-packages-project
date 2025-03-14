import { Entity, Column } from 'typeorm';
import { registerEntity, HasPrimaryFullEntity } from '@cs/nest-typeorm';

@Entity('sys_role')
export class RoleEntity extends HasPrimaryFullEntity {
  @Column({
    name: 'rolename',
    comment: '角色名称',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  rolename: string;

  @Column({
    name: 'rolecode',
    comment: '角色编码',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  rolecode: string;
}

// 注册用户实体到默认连接
registerEntity('test1', RoleEntity);
