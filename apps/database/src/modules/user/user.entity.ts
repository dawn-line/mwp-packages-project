import { Entity, Column, PrimaryColumn } from 'typeorm';
import { HasPrimaryFullEntity, registerEntity } from '@cs/nest-typeorm';

@Entity({
  name: 'user',
  comment: '用户表',
})
export class UserEntity extends HasPrimaryFullEntity {
  @Column({
    name: 'username',
    comment: '用户名',
    type: 'varchar',
    length: 50,
    nullable: false,
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
    name: 'phone',
    comment: '手机号',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'status',
    comment: '状态: 1-正常, 0-禁用',
    type: 'tinyint',
    default: 1,
    nullable: true,
  })
  status: number;
}
// 注册实体到 test 数据库连接
// registerEntity('test', User);
