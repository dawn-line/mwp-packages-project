import { Type } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { DataSourceManagerImpl } from '../dataSource.manager';
export declare const REPOSITORY_FACTORY_TOKEN_PREFIX = "REPOSITORY_FACTORY_";
export declare function getRepositoryToken(entity: any, repositoryClass: Type<any>): string;
export interface CreateRepositoryProviderOptions<T, R extends BaseRepository<T>> {
    entity: EntityTarget<T>;
    repository?: Type<R>;
    connectionName?: string;
}
export declare function createRepositoryProvider<T, R extends BaseRepository<T>>(options: CreateRepositoryProviderOptions<T, R>): {
    provide: string;
    useFactory: (dataSourceManager: DataSourceManagerImpl) => R;
    inject: (typeof DataSourceManagerImpl)[];
};
export interface InjectRepositoryOptions<T, R extends BaseRepository<T>> {
    entity: EntityTarget<T>;
    repository?: Type<R>;
    connectionName?: string;
}
export declare function InjectRepository<T, R extends BaseRepository<T>>(options: InjectRepositoryOptions<T, R>): PropertyDecorator;
//# sourceMappingURL=inject-repository.decorator.d.ts.map