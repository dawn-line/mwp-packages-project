import { DynamicModule } from '@nestjs/common';
import { DatabaseModuleOptions, DatabaseModuleAsyncOptions, EntityRegistration } from './database.types';
export declare class DatabaseModule {
    static forRoot(options: DatabaseModuleOptions): DynamicModule;
    static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule;
    static forFeature(registration: EntityRegistration): DynamicModule;
    static forFeatures(registrations: EntityRegistration[]): DynamicModule;
}
//# sourceMappingURL=database.module.d.ts.map