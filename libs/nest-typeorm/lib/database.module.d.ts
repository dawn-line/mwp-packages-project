import { DynamicModule } from '@nestjs/common';
import { DatabaseModuleOptions, DatabaseModuleAsyncOptions } from './database.types';
export declare class DatabaseModule {
    static forRoot(options: DatabaseModuleOptions): DynamicModule;
    static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule;
    private static createConnectionProvider;
    private static createConnections;
}
//# sourceMappingURL=database.module.d.ts.map