import { AxiosRequestConfig } from 'axios';
import { ExtendedJsonRpcRequest } from './json-rpc/types';
export declare const RPC_SERVICE_METADATA: unique symbol;
export declare const RPC_METHOD_METADATA: unique symbol;
export declare const RPC_PARAMS_METADATA: unique symbol;
export declare const RPC_MODULE_OPTIONS: unique symbol;
export interface RpcModuleOptions {
    protocol: string;
    timeout?: number;
}
export interface RpcModuleAsyncOptions {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<RpcModuleOptions> | RpcModuleOptions;
    inject?: any[];
}
export interface RpcConfig {
    serviceName: string;
    servicePath?: string;
    groupName?: string;
    clusters?: string;
}
export interface RpcRequestClient {
    rpcConfig: RpcConfig;
    payload: ExtendedJsonRpcRequest;
    reqOptions?: AxiosRequestConfig;
}
export interface RpcServiceOptions {
    name: string;
    description?: string;
}
export interface RpcMethodOptions {
    name: string;
    description?: string;
    returnType?: string;
    returnDescription?: string;
}
export interface RpcParamOptions {
    name: string;
    description?: string;
    type?: string;
    required?: boolean;
    defaultValue?: any;
}
//# sourceMappingURL=rpc.interface.d.ts.map