import { JsonRpcResponse, JSONRPCConfig, JsonRpcRequestClient } from './types';
import { AxiosRequestConfig } from 'axios';
export declare class JsonRpcClient {
    private rpcConfig;
    private axiosInstance;
    constructor(rpcConfig: JSONRPCConfig);
    call(requestClient: JsonRpcRequestClient, reqOptions?: AxiosRequestConfig): Promise<JsonRpcResponse | void>;
    private sendNotification;
    private sendRequest;
}
//# sourceMappingURL=client.d.ts.map