import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { QueryConditionInput, PageResult } from '@cs/nest-common';
export declare abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    findOne(dto: Partial<T>): Promise<T>;
    findMany(dto: Partial<T>, take?: number, skip?: number): Promise<T[]>;
    findManyBase<R>(queryConditionInput: QueryConditionInput): Promise<R[] | PageResult<R[]>>;
    saveOne(entity: DeepPartial<T>): Promise<number>;
    saveMany(entities: DeepPartial<T>[]): Promise<number>;
    updateByCondition(updateData: Partial<T>, conditions: Partial<T>): Promise<number>;
    softDeletion(conditions: Partial<T>): Promise<number>;
    hardDelete(conditions: Partial<T>): Promise<number>;
    executeSql(querySql: string, parameters?: Record<string, any>): Promise<any>;
}
export declare class CustomRepository<T extends ObjectLiteral> extends BaseRepository<T> {
}
//# sourceMappingURL=base.repository.d.ts.map