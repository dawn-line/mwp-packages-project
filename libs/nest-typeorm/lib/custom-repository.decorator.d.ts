import { Type } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
export declare function CustomRepository<T extends ObjectLiteral>(entity: Type<T>): (target: Type<any>) => void;
export declare function getRepositoryToken(entity: Function): Function;
export declare function getEntityRepositoryMap(): Map<Function, Type<any>>;
//# sourceMappingURL=custom-repository.decorator.d.ts.map