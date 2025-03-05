import { PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
import { HasEnableEntity, HasEnableTreeEntity } from './hasEnable.entity';
// 单独主键
export abstract class HasOnlyPrimaryEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'bigint',
  })
  id: string;
}

export abstract class HasPrimaryEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'bigint',
  })
  id: string;
}

export abstract class HasPrimaryTreeEntity extends TreeEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'bigint',
  })
  id: string;
}

export abstract class HasPrimaryFullEntity extends HasEnableEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'bigint',
  })
  id: string;
}

export abstract class HasPrimaryFullTreeEntity extends HasEnableTreeEntity {
  @PrimaryColumn({
    name: 'id',
    comment: '主键',
    type: 'bigint',
  })
  id: string;
}
