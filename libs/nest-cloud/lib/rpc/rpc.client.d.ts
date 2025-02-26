import { JsonRpcResponse } from './json-rpc/types';
import { RpcModuleOptions, RpcRequestClient } from './rpc.interface';
export declare class RpcClient {
    private readonly options;
    private client;
    private nacosNaming;
    private readonly logger;
    constructor(options: RpcModuleOptions);
    call(request: RpcRequestClient): Promise<JsonRpcResponse | void>;
    private initNacosNaming;
    private getHealthyInstance;
}
//# sourceMappingURL=rpc.client.d.ts.map