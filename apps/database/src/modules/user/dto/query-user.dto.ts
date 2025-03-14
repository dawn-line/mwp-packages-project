import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum([0, 1], { message: '状态值必须是0或1' })
  @Type(() => Number)
  status?: number;

  @IsOptional()
  @IsString()
  deptId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '页码最小为1' })
  pageNum?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '每页最小为1条' })
  @Max(100, { message: '每页最大为100条' })
  pageSize?: number = 10;
}
