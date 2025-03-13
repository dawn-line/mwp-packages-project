import { Repository, ObjectLiteral, DeepPartial, UpdateResult } from 'typeorm';
import { QueryConditionInput, PageResult } from '@cs/nest-common';
export declare abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    findOne(dto: Partial<T>): Promise<T>;
    findMany(dto: Partial<T>, take?: number, skip?: number): Promise<T[]>;
    findManyBase<R>(queryConditionInput: QueryConditionInput): Promise<R[] | PageResult<R[]>>;
    saveOne(entity: DeepPartial<T>): Promise<number>;
    saveMany(entities: DeepPartial<T>[]): Promise<number>;
    updateByCondition(updateData: Partial<T>, conditions: Partial<T>): Promise<number>;
    softDelete(conditions: Partial<T>): Promise<UpdateResult>;
    hardDelete(conditions: Partial<T>): Promise<number>;
    executeSql(querySql: string, parameters?: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=base.repository.d.ts.map