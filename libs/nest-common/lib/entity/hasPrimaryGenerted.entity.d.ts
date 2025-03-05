import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
import { HasActionEntity, HasActionTreeEntity } from './hasEnable.entity';
export declare abstract class HasPrimaryGenertedEntity extends BaseEntity {
    id: string;
}
export declare abstract class HasPrimaryGenertedTreeEntity extends TreeEntity {
    id: string;
}
export declare abstract class HasPrimaryGenertedFullEntity extends HasActionEntity {
    id: string;
}
export declare abstract class HasPrimaryGenertedFullTreeEntity extends HasActionTreeEntity {
    id: string;
}
//# sourceMappingURL=hasPrimaryGenerted.entity.d.ts.map
