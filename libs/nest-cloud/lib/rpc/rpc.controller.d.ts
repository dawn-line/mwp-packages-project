import { RpcRegistry } from './rpc.registry';
import { JsonRpcRequest, JsonRpcResponse } from './json-rpc/types';
import { RpcServiceInfo } from './rpc.registry';
export declare class RpcController {
    private readonly rpcRegistry;
    constructor(rpcRegistry: RpcRegistry);
    handleRpcRequest(request: JsonRpcRequest): Promise<JsonRpcResponse | void>;
    private handleSingleRequest;
    getServicesInfo(): RpcServiceInfo[];
}
//# sourceMappingURL=rpc.controller.d.ts.map