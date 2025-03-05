import { BaseDto } from './base.dto';
import { TreeDto } from './tree.dto';
import { HasEnableDto, HasEnableTreeDto } from './hasEnable.dto';
export declare abstract class HasPrimaryDto extends BaseDto {
    id?: string;
}
export declare abstract class HasPrimaryTreeDto extends TreeDto {
    id?: string;
}
export declare abstract class HasPrimaryFullDto extends HasEnableDto {
    id?: string;
}
export declare abstract class HasPrimaryFullTreeDto extends HasEnableTreeDto {
    id?: string;
}
//# sourceMappingURL=hasPrimary.dto.d.ts.map