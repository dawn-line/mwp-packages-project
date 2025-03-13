import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Type } from '@nestjs/common';
export declare class RepositoryFactory {
    static create<T extends ObjectLiteral, R extends BaseRepository<T>>(dataSource: DataSource, entity: EntityTarget<T>, customRepositoryClass: Type<R>): R;
}
//# sourceMappingURL=repository.factory.d.ts.map