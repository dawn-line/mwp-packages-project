import { DeepPartial, FindOptionsWhere, Repository, FindManyOptions, FindOneOptions } from 'typeorm';
export declare abstract class BaseService<T> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findWithPagination(page?: number, limit?: number, options?: FindManyOptions<T>): Promise<[T[], number]>;
    findById(id: any, options?: FindOneOptions<T>): Promise<T>;
    findOne(options: FindOneOptions<T>): Promise<T>;
    findByIds(ids: any[], options?: FindManyOptions<T>): Promise<T[]>;
    create(data: DeepPartial<T>): Promise<T>;
    createMany(data: DeepPartial<T>[]): Promise<T[]>;
    update(id: any, data: DeepPartial<T>): Promise<T>;
    updateMany(criteria: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<boolean>;
    delete(id: any): Promise<boolean>;
    deleteMany(criteria: FindOptionsWhere<T>): Promise<boolean>;
    count(options?: FindManyOptions<T>): Promise<number>;
    exists(options?: FindManyOptions<T>): Promise<boolean>;
    query(sql: string, parameters?: any[]): Promise<any>;
}
//# sourceMappingURL=base.service.d.ts.map