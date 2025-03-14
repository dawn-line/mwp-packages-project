import { Entity, Column } from 'typeorm';
import { registerEntity, HasPrimaryFullEntity } from '@cs/nest-typeorm';

@Entity('sys_product')
export class ProductEntity extends HasPrimaryFullEntity {
  @Column({
    name: 'productname',
    comment: '产品名称',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  productname: string;

  @Column({
    name: 'productcode',
    comment: '产品编码',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  productcode: string;
}

// 注册用户实体到默认连接
registerEntity('test', ProductEntity);
