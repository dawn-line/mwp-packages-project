import { DynamicModule } from '@nestjs/common';
import { ConfigOptions, ConfigAsyncOptions } from './config/config.schema.interface';
export declare class ConfigModule {
    static forRoot(options: ConfigOptions, isGlobal?: boolean): Promise<DynamicModule>;
    static forRootAsync(options: ConfigAsyncOptions, isGlobal?: boolean): DynamicModule;
}
//# sourceMappingURL=config.module.d.ts.map