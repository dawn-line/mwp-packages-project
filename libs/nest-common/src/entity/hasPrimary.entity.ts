import { PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
import { HasActionEntity, HasActionTreeEntity } from './hasAction.entity';
// 单独主键
export abstract class HasOnlyPrimaryEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'varchar',
    length: 50,
  })
  id: string;
}

export abstract class HasPrimaryEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'varchar',
    length: 50,
  })
  id: string;
}

export abstract class HasPrimaryTreeEntity extends TreeEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'varchar',
    length: 50,
  })
  id: string;
}

export abstract class HasPrimaryFullEntity extends HasActionEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'varchar',
    length: 50,
  })
  id: string;
}

export abstract class HasPrimaryFullTreeEntity extends HasActionTreeEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'varchar',
    length: 50,
  })
  id: string;
}
