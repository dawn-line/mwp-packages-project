import { OrderByCondition } from 'typeorm';
import { IsString, IsInt, IsArray, IsObject } from 'class-validator';
export class QueryConditionInput {
  @IsArray()
  select?: string[];
  @IsString()
  conditionLambda: string;
  @IsObject()
  conditionValue: object;

  orderBy?: OrderByCondition;
  @IsString()
  tableName?: string;
  @IsString()
  groupBy?: string;
  @IsString()
  havingLambda?: string;
  @IsObject()
  havingValue?: object;
  @IsInt()
  skip?: number;
  @IsInt()
  take?: number;
}
