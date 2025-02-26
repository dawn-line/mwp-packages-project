import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';
export abstract class TreeEntity extends BaseEntity {
  @Column({
    name: 'parent_id',
    comment: '父节点主键',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  parentId: string;
  @Column({
    name: 'full_id',
    comment: '主键全路径',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  fullId: string;
  @Column({
    name: 'full_name',
    comment: '名称全路径',
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  fullName: string;
  @Column({
    name: 'level',
    comment: '层级',
    type: 'int',
    nullable: true,
  })
  level: number;
  @Column({
    name: 'is_leaf',
    comment: '子节点标识',
    type: 'tinyint',
    nullable: true,
  })
  isLeaf: boolean;
}
