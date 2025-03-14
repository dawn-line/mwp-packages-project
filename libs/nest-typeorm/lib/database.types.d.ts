import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ModuleMetadata } from '@nestjs/common';
export interface EntityClassOrSchema {
    new (...args: any[]): any;
}
export interface DatabaseModuleOption extends MysqlConnectionOptions {
    name?: string;
}
export type DatabaseModuleOptions = Record<string, DatabaseModuleOption>;
export interface EntityRegistration {
    connectionName: string;
    entities: EntityClassOrSchema[];
}
export interface DatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
    inject?: any[];
}
export interface DatabaseOptionsFactory {
    createDatabaseOptions(): Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
}
export interface DataSourceManager {
    getDataSource(name?: string): DataSource;
    getAllDataSources(): Map<string, DataSource>;
}
//# sourceMappingURL=database.types.d.ts.map