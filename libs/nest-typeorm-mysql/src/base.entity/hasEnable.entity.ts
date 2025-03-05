import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
export abstract class HasEnableEntity extends BaseEntity {
  @Column({
    name: 'sort_code',
    comment: '排序',
    type: 'int',
    nullable: true,
  })
  sortCode: number;
  @Column({
    name: 'is_enable',
    comment: '启用',
    type: 'tinyint',
    nullable: true,
    default: true,
  })
  isEnable: boolean;
}

export abstract class HasEnableTreeEntity extends TreeEntity {
  @Column({
    name: 'sort_code',
    comment: '排序',
    type: 'int',
    nullable: true,
  })
  sortCode: number;
  @Column({
    name: 'is_enable',
    comment: '启用',
    type: 'tinyint',
    nullable: true,
    default: true,
  })
  isEnable: boolean;
}
