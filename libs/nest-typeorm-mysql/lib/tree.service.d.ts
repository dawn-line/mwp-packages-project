import { DeepPartial, TreeRepository } from 'typeorm';
import { BaseService } from './base.service';
export declare abstract class TreeService<T> extends BaseService<T> {
    protected treeRepository: TreeRepository<T>;
    constructor(repository: TreeRepository<T>);
    findRoots(): Promise<T[]>;
    findDescendants(entity: T): Promise<T[]>;
    findDescendantsTree(entity: T): Promise<T>;
    findAncestors(entity: T): Promise<T[]>;
    findAncestorsTree(entity: T): Promise<T>;
    createTree(data: DeepPartial<T>, parent?: T): Promise<T>;
    getTree(): Promise<T[]>;
    countDescendants(entity: T): Promise<number>;
    countAncestors(entity: T): Promise<number>;
}
//# sourceMappingURL=tree.service.d.ts.map