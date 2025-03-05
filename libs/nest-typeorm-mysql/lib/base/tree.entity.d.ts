import { BaseEntity } from './base.entity';
export declare abstract class TreeEntity extends BaseEntity {
    name: string;
    parentId: number;
    parent: this;
    children: this[];
}
//# sourceMappingURL=tree.entity.d.ts.map