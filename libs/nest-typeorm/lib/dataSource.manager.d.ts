import { Type } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { DataSourceManager } from './database.types';
import { BaseRepository } from './base.repository';
export declare class DataSourceManagerImpl implements DataSourceManager {
    private readonly dataSources;
    constructor(initialDataSources?: Map<string, DataSource>);
    getDataSource(name?: string): DataSource;
    getAllDataSources(): Map<string, DataSource>;
    registerDataSource(name: string, dataSource: DataSource): void;
    getCustomRepository<T, R extends BaseRepository<T>>(entity: EntityTarget<T>, customRepositoryClass: Type<R>, connectionName?: string): R;
}
//# sourceMappingURL=dataSource.manager.d.ts.map