import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间',
    type: 'datetime',
    nullable: true,
  })
  createdAt: Date;
  @Column({
    name: 'creator_id',
    comment: '创建用户主键',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  creatorId: string;
  @Column({
    name: 'creator_name',
    comment: '添加人',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  creatorName: string;
  @UpdateDateColumn({
    name: 'modifier_at',
    comment: '上次修改时间',
    type: 'datetime',
    nullable: true,
  })
  modifierAt: Date;
  @Column({
    name: 'modifier_id',
    comment: '修改用户主键',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  modifierId: string;
  @Column({
    name: 'modifier_name',
    comment: '修改人',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  modifierName: string;
  @Column({
    name: 'is_removed',
    comment: '删除标识',
    type: 'tinyint',
    default: false,
    nullable: true,
  })
  isRemoved: boolean;
  @Column({
    name: 'version',
    comment: '版本号',
    type: 'bigint',
    nullable: true,
  })
  version: number;

  @BeforeUpdate()
  updateVersionTimestamp() {
    this.version = Date.now();
  }

  @BeforeInsert()
  setInitialVersion() {
    this.version = Date.now();
  }
}
