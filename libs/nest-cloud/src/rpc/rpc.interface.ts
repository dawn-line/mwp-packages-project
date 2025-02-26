import { AxiosRequestConfig } from 'axios';
import { ExtendedJsonRpcRequest } from './json-rpc/types';
export const RPC_SERVICE_METADATA = Symbol('RPC_SERVICE_METADATA');
export const RPC_METHOD_METADATA = Symbol('RPC_METHOD_METADATA');
export const RPC_PARAMS_METADATA = Symbol('RPC_PARAMS_METADATA');
export const RPC_MODULE_OPTIONS = Symbol('RPC_MODULE_OPTIONS');
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
