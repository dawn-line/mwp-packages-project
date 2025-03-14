import { DynamicModule, Type } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { EntityTarget } from 'typeorm';
export interface RepositoryRegistration<T, R extends BaseRepository<T>> {
    entity: EntityTarget<T>;
    repository?: Type<R>;
    connectionName?: string;
}
export declare function createRepositoryModule(repositories: RepositoryRegistration<any, BaseRepository<any>>[]): DynamicModule;
export declare class RegistModule {
    static forRepositories(repositories: RepositoryRegistration<any, BaseRepository<any>>[]): DynamicModule;
}
//# sourceMappingURL=repository-module.decorator.d.ts.map