import { TreeEntity } from './tree.entity';
import { TreeRepository } from 'typeorm';
export declare abstract class BaseTreeRepository<T extends TreeEntity> extends TreeRepository<T> {
    createTreeNode(entity: Partial<T>): Promise<T>;
    updateTreeNode(id: number, partialEntity: Partial<T>): Promise<boolean>;
    deleteTreeNode(id: number): Promise<boolean>;
    getTree(): Promise<T[]>;
    getTreeWithAncestors(id: number): Promise<T[]>;
    getTreeWithDescendants(id: number): Promise<T[]>;
    getParent(id: number): Promise<T | null>;
    getChildren(id: number): Promise<T[]>;
}
//# sourceMappingURL=tree.repository.d.ts.map