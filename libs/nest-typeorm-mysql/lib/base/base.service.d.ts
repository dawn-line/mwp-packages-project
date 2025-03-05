import { BaseEntity } from './base.entity';
import { BaseRepository } from './base.repository';
import { FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export declare abstract class BaseService<T extends BaseEntity> {
    protected readonly repository: BaseRepository<T>;
    constructor(repository: BaseRepository<T>);
    create(entity: DeepPartial<T>): Promise<T>;
    createMany(entities: DeepPartial<T>[]): Promise<T[]>;
    update(id: number, entity: QueryDeepPartialEntity<T>): Promise<boolean>;
    updateMany(criteria: FindManyOptions<T>['where'], entity: QueryDeepPartialEntity<T>): Promise<boolean>;
    softDelete(id: number): Promise<boolean>;
    softDeleteMany(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    deleteMany(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    restore(id: number): Promise<boolean>;
    restoreMany(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    findOne(options: FindOneOptions<T>): Promise<T | undefined>;
    findById(id: number): Promise<T | undefined>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    paginate(options?: FindManyOptions<T>, page?: number, limit?: number): Promise<[T[], number]>;
}
//# sourceMappingURL=base.service.d.ts.map