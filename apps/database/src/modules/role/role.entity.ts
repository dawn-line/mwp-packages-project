import { Entity, Column } from 'typeorm';
import { HasPrimaryFullEntity } from '@cs/nest-typeorm';
import { registerEntity } from '@cs/nest-typeorm';

@Entity({ name: 'sys_role' })
export class Role extends HasPrimaryFullEntity {
  @Column({
    name: 'role_name',
    comment: '角色名称',
    type: 'varchar',
    length: 50,
  })
  roleName: string;

  @Column({
    name: 'role_code',
    comment: '角色编码',
    type: 'varchar',
    length: 50,
  })
  roleCode: string;

  @Column({
    name: 'description',
    comment: '角色描述',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  description: string;
}

registerEntity('test1', Role);
