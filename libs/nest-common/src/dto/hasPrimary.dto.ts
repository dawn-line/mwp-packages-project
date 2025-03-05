import { BaseDto } from './base.dto';
import { TreeDto } from './tree.dto';
import { HasEnableDto, HasEnableTreeDto } from './hasEnable.dto';
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

export abstract class HasPrimaryFullDto extends HasEnableDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}

export abstract class HasPrimaryFullTreeDto extends HasEnableTreeDto {
  @PrimaryColumn()
  @IsString()
  id?: string;
}
