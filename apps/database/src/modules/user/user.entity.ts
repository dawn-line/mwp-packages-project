import { Entity, Column, PrimaryColumn } from 'typeorm';
import { HasPrimaryFullEntity, registerEntity } from '@cs/nest-typeorm';

@Entity({ name: 'sys_user' })
export class User extends HasPrimaryFullEntity {
  @PrimaryColumn({
    name: 'user_role_id',
    comment: '用户角色id',
    type: 'bigint',
  })
  userRoleId: string;
  @Column({
    name: 'username',
    comment: '用户名',
    type: 'varchar',
    length: 50,
  })
  username: string;

  @Column({
    name: 'password',
    comment: '密码',
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    name: 'email',
    comment: '邮箱',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'phone',
    comment: '手机号',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;
}

// 注册实体到 test 数据库连接
registerEntity('test', User);
