import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { QueryConditionInput, PageResult } from '@cs/nest-common';
export declare abstract class SingleService<T extends ObjectLiteral> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findOne(dto: Partial<T>): Promise<T>;
    findMany(dto: Partial<T>, take?: number, skip?: number): Promise<T[]>;
    findManyBase<T>(queryConditionInput: QueryConditionInput): Promise<T[] | PageResult<T[]>>;
    saveOne(entity: DeepPartial<T>): Promise<number>;
    saveMany(entities: DeepPartial<T>[]): Promise<number>;
    updateByCondition(updateData: Partial<T>, conditions: Partial<T>): Promise<number>;
    softDelete(conditions: Partial<T>): Promise<number>;
    hardDelete(conditions: Partial<T>): Promise<number>;
    executeSql(querySql: string, parameters?: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=single.service.d.ts.map