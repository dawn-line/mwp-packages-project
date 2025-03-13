import { Type } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { DataSourceManager } from './database.types';
export declare class DataSourceManagerImpl implements DataSourceManager {
    private readonly dataSources;
    constructor(initialDataSources?: Map<string, DataSource>);
    getDataSource(name?: string): DataSource;
    getAllDataSources(): Map<string, DataSource>;
    registerDataSource(name: string, dataSource: DataSource): void;
    getCustomRepository<T, R>(entity: EntityTarget<T>, customRepositoryClass: Type<R>, connectionName?: string): R;
}
//# sourceMappingURL=dataSource.managerImpl.d.ts.map