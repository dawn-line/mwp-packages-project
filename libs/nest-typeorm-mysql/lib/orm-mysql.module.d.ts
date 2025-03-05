import { DynamicModule } from '@nestjs/common';
import { DatabaseModuleOptions } from './orm-mysql.interfaces';
export declare class DatabaseModule {
    static forRoot(options: DatabaseModuleOptions): DynamicModule;
    static forRootAsync(options: {
        useFactory: (...args: any[]) => Promise<DatabaseModuleOptions> | DatabaseModuleOptions;
        inject?: any[];
    }): DynamicModule;
}
//# sourceMappingURL=orm-mysql.module.d.ts.map