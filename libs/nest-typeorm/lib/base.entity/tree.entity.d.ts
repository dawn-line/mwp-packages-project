import { BaseEntity } from './base.entity';
export declare abstract class TreeEntity extends BaseEntity {
    parentId: string;
    fullId: string;
    fullName: string;
    level: number;
    isLeaf: boolean;
}
//# sourceMappingURL=tree.entity.d.ts.map