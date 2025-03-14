import { Repository, ObjectLiteral, DeepPartial, UpdateResult, EntityTarget, DataSource } from 'typeorm';
import { QueryConditionInput, PageResult } from '@cs/nest-common';
import { Type } from '@nestjs/common';
export declare class EnhancedRepository<T extends ObjectLiteral> {
    protected repository: Repository<T>;
    static create<T extends ObjectLiteral>(dataSource: DataSource, entity: EntityTarget<T>): EnhancedRepository<T>;
    private static proxyRepositoryMethods;
    private static defineCommonMethods;
    find: (options?: any) => Promise<T[]>;
    findOne: (options?: any) => Promise<T>;
    save: (entities: any, options?: any) => Promise<any>;
    update: (criteria: any, partialEntity: any) => Promise<any>;
    delete: (criteria: any) => Promise<any>;
    count: (options?: any) => Promise<number>;
    createQueryBuilder: (alias?: string) => any;
    query: (query: string, parameters?: any[]) => Promise<any>;
    create: (entityLike?: any) => T;
    findOneByDto(dto: Partial<T>): Promise<T>;
    findManyByDto(dto: Partial<T>, take?: number, skip?: number): Promise<T[]>;
    findManyBase<R>(queryConditionInput: QueryConditionInput): Promise<R[] | PageResult<R[]>>;
    saveOne(entity: DeepPartial<T>): Promise<number>;
    saveMany(entities: DeepPartial<T>[], batchSize?: number): Promise<number>;
    updateByCondition(updateData: Partial<T>, conditions: Partial<T>): Promise<number>;
    softDelete(conditions: Partial<T>): Promise<UpdateResult>;
    hardDelete(conditions: Partial<T>): Promise<number>;
    executeSql(querySql: string, parameters?: Record<string, any>): Promise<any>;
    getRepository(): Repository<T>;
}
export declare class EnhancedRepositoryFactory {
    static create<T extends ObjectLiteral, R extends EnhancedRepository<T>>(dataSource: DataSource, entity: EntityTarget<T>, customRepositoryClass: Type<R>): R;
}
//# sourceMappingURL=enhanced.repository.d.ts.map