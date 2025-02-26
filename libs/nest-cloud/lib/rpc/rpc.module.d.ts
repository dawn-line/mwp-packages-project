import { DynamicModule } from '@nestjs/common';
import { RpcModuleOptions, RpcModuleAsyncOptions } from './rpc.interface';
export declare class RpcModule {
    static forRoot(options: RpcModuleOptions, isGlobal?: boolean): DynamicModule;
    static forRootAsync(options: RpcModuleAsyncOptions, isGlobal?: boolean): DynamicModule;
}
//# sourceMappingURL=rpc.module.d.ts.map