import { Repository, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { BaseEntity } from './base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export declare abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
    createEntity(entity: DeepPartial<T>): Promise<T>;
    createEntities(entities: DeepPartial<T>[]): Promise<T[]>;
    updateEntity(id: number, partialEntity: QueryDeepPartialEntity<T>): Promise<boolean>;
    updateEntities(criteria: FindManyOptions<T>['where'], partialEntity: QueryDeepPartialEntity<T>): Promise<boolean>;
    softDeleteEntity(id: number): Promise<boolean>;
    softDeleteEntities(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    deleteEntity(id: number): Promise<boolean>;
    deleteEntities(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    restoreEntity(id: number): Promise<boolean>;
    restoreEntities(criteria: FindManyOptions<T>['where']): Promise<boolean>;
    findOneEntity(options: FindOneOptions<T>): Promise<T | undefined>;
    findById(id: number): Promise<T | undefined>;
    findEntities(options: FindManyOptions<T>): Promise<T[]>;
    paginate(options: FindManyOptions<T>, page?: number, limit?: number): Promise<[T[], number]>;
}
//# sourceMappingURL=base.repository.d.ts.map