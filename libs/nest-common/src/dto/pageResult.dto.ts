import { IsInt } from 'class-validator';
export class PageResult<T> {
  @IsInt()
  count: number;
  result: T;
}
