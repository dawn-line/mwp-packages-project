import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
import { HasActionEntity, HasActionTreeEntity } from './hasAction.entity';

export abstract class HasPrimaryGenertedEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '主键',
  })
  id: string;
}

export abstract class HasPrimaryGenertedTreeEntity extends TreeEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '主键',
  })
  id: string;
}

export abstract class HasPrimaryGenertedFullEntity extends HasActionEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '主键',
  })
  id: string;
}

export abstract class HasPrimaryGenertedFullTreeEntity extends HasActionTreeEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: '主键',
  })
  id: string;
}
