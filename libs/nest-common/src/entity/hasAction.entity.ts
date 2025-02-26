import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
export abstract class HasActionEntity extends BaseEntity {
  @Column({
    name: 'sort_code',
    comment: '排序',
    type: 'int',
    nullable: true,
  })
  sortCode: number;
  @Column({
    name: 'is_active',
    comment: '状态',
    type: 'tinyint',
    nullable: true,
  })
  isActive: boolean;
}

export abstract class HasActionTreeEntity extends TreeEntity {
  @Column({
    name: 'sort_code',
    comment: '排序',
    type: 'int',
    nullable: true,
  })
  sortCode: number;
  @Column({
    name: 'is_active',
    comment: '状态',
    type: 'tinyint',
    nullable: true,
  })
  isActive: boolean;
}
