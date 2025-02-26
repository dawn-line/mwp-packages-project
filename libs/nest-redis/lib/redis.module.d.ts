import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
export declare class RedisModule implements OnModuleDestroy {
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
    private static createAysncProvider;
    private static createClient;
    private static createAsyncClientOptions;
    onModuleDestroy(): void;
}
//# sourceMappingURL=redis.module.d.ts.map