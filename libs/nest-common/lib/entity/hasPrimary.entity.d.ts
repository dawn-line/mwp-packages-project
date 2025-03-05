import { BaseEntity } from './base.entity';
import { TreeEntity } from './tree.entity';
import { HasActionEntity, HasActionTreeEntity } from './hasEnable.entity';
export declare abstract class HasOnlyPrimaryEntity {
    id: string;
}
export declare abstract class HasPrimaryEntity extends BaseEntity {
    id: string;
}
export declare abstract class HasPrimaryTreeEntity extends TreeEntity {
    id: string;
}
export declare abstract class HasPrimaryFullEntity extends HasActionEntity {
    id: string;
}
export declare abstract class HasPrimaryFullTreeEntity extends HasActionTreeEntity {
    id: string;
}
//# sourceMappingURL=hasPrimary.entity.d.ts.map
