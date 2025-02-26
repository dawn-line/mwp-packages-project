import { DynamicModule } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleAsyncOptions } from './http.interface';
export declare class HttpModule {
    static forRegister(options: HttpModuleOptions, isGlobal?: boolean): DynamicModule;
    static forRegisterAsync(options: HttpModuleAsyncOptions, isGlobal?: boolean): DynamicModule;
}
//# sourceMappingURL=http.module.d.ts.map