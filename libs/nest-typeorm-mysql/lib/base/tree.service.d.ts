import { TreeEntity } from './tree.entity';
import { BaseTreeRepository } from './tree.repository';
export declare abstract class BaseTreeService<T extends TreeEntity> {
    protected readonly repository: BaseTreeRepository<T>;
    constructor(repository: BaseTreeRepository<T>);
    create(entity: Partial<T>): Promise<T>;
    update(id: number, entity: Partial<T>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    getTree(): Promise<T[]>;
    getAncestors(id: number): Promise<T[]>;
    getDescendants(id: number): Promise<T[]>;
    getParent(id: number): Promise<T | null>;
    getChildren(id: number): Promise<T[]>;
}
//# sourceMappingURL=tree.service.d.ts.map