import { BaseDto } from './base.dto';
import { TreeDto } from './tree.dto';
import { HasActionDto, HasActionTreeDto } from './hasAction.dto';
import { IsString } from 'class-validator';
import { PrimaryColumn } from 'typeorm';
export abstract class HasPrimaryDto extends BaseDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}

export abstract class HasPrimaryTreeDto extends TreeDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}

export abstract class HasPrimaryFullDto extends HasActionDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}

export abstract class HasPrimaryFullTreeDto extends HasActionTreeDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}
