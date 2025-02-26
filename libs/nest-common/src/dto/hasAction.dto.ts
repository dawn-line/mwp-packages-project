import { BaseDto } from './base.dto';
import { TreeDto } from './tree.dto';
import { IsBoolean, IsInt } from 'class-validator';
export abstract class HasActionDto extends BaseDto {
  @IsInt()
  sortCode?: number;
  @IsBoolean()
  isActive?: boolean;
}

export abstract class HasActionTreeDto extends TreeDto {
  @IsInt()
  sortCode?: number;
  @IsBoolean()
  isActive?: boolean;
}
