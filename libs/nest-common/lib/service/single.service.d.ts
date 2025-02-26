import { Repository } from 'typeorm';
import { QueryConditionInput, PageResult } from '../dto';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
export declare abstract class SingleService<Entity, Dto> {
    private readonly singleRepository;
    constructor(singleRepository: Repository<Entity>);
    private defaultCtxParams;
    getOneBase(entitiesDto: any): Promise<any>;
    findManyBase(entitiesDto: any): Promise<any>;
    getManyBase(queryConditionInput: QueryConditionInput): Promise<any[] | PageResult<any[]>>;
    createOneBase(entityDto: any, ctxParams?: any, options?: SaveOptions): Promise<any>;
    updateOneBase(entityDto: any, ctxParams?: any, options?: SaveOptions): Promise<any>;
    updateByCondition(entityDto: any, findEntityDto: any, ctxParams?: any): Promise<any>;
    saveManyBase(entitiesDto: any[], ctxParams?: any, options?: SaveOptions): Promise<any>;
    deleteBase(entitiesDto: any, ctxParams?: any, options?: SaveOptions): Promise<any>;
    destoryBase(entitiesDto: any, options?: SaveOptions): Promise<any>;
    execute(querysql: string, parameters?: object): Promise<any>;
}
//# sourceMappingURL=single.service.d.ts.map