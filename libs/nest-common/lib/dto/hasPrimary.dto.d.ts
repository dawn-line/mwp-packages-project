import { BaseDto } from './base.dto';
import { TreeDto } from './tree.dto';
import { HasActionDto, HasActionTreeDto } from './hasAction.dto';
export declare abstract class HasPrimaryDto extends BaseDto {
    id?: string;
}
export declare abstract class HasPrimaryTreeDto extends TreeDto {
    id?: string;
}
export declare abstract class HasPrimaryFullDto extends HasActionDto {
    id?: string;
}
export declare abstract class HasPrimaryFullTreeDto extends HasActionTreeDto {
    id?: string;
}
//# sourceMappingURL=hasPrimary.dto.d.ts.map