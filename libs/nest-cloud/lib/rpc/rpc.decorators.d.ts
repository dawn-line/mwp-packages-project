import 'reflect-metadata';
import { RpcServiceOptions, RpcMethodOptions, RpcParamOptions } from './rpc.interface';
export declare function RpcService(options: RpcServiceOptions | string): ClassDecorator;
export declare function RpcMethod(options?: RpcMethodOptions): MethodDecorator;
export declare function RpcParam(options: RpcParamOptions | string): ParameterDecorator;
//# sourceMappingURL=rpc.decorators.d.ts.map