import { DynamicModule } from '@nestjs/common';
import { CasAsyncOptions, CasOptions } from './cas-options.interface';
export declare class CasClientModule {
    static forRoot(options: CasOptions, isGlobal?: boolean): DynamicModule;
    static forRootAsync(options: CasAsyncOptions, isGlobal?: boolean): DynamicModule;
}
//# sourceMappingURL=cas-client.module.d.ts.map