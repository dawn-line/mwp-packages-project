import { Entity, Column } from 'typeorm';
import { registerEntity, HasPrimaryFullEntity } from '@cs/nest-typeorm';

@Entity('sys_user')
export class UserEntity extends HasPrimaryFullEntity {
  @Column({
    name: 'username',
    comment: '用户名',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: false,
  })
  username: string;

  @Column({
    name: 'password',
    comment: '密码',
    type: 'varchar',
    length: 100,
    nullable: false,
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
    name: 'mobile',
    comment: '手机号',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  mobile: string;

  @Column({
    name: 'real_name',
    comment: '真实姓名',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  realName: string;

  @Column({
    name: 'avatar',
    comment: '头像URL',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatar: string;

  @Column({
    name: 'status',
    comment: '状态：0-禁用，1-正常',
    type: 'tinyint',
    default: 1,
    nullable: true,
  })
  status: number;

  @Column({
    name: 'dept_id',
    comment: '部门ID',
    type: 'bigint',
    nullable: true,
  })
  deptId: string;

  @Column({
    name: 'last_login_time',
    comment: '最后登录时间',
    type: 'datetime',
    nullable: true,
  })
  lastLoginTime: Date;
}

// 注册用户实体到默认连接
registerEntity('test', UserEntity);
