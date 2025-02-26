import 'reflect-metadata';
import {
  RPC_SERVICE_METADATA,
  RPC_METHOD_METADATA,
  RPC_PARAMS_METADATA,
  RpcServiceOptions,
  RpcMethodOptions,
  RpcParamOptions,
} from './rpc.interface';
// 服务装饰器
export function RpcService(
  options: RpcServiceOptions | string,
): ClassDecorator {
  return (target: any) => {
    const serviceOptions =
      typeof options === 'string' ? { name: options } : options;

    Reflect.defineMetadata(RPC_SERVICE_METADATA, serviceOptions, target);
  };
}

// 方法装饰器
export function RpcMethod(options?: RpcMethodOptions): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const methodOptions: RpcMethodOptions = options;

    Reflect.defineMetadata(
      RPC_METHOD_METADATA,
      {
        name: methodOptions.name || propertyKey.toString(),
        originalMethod: propertyKey.toString(),
        description: methodOptions.description,
        returnType: methodOptions.returnType,
        returnDescription: methodOptions.returnDescription,
      },
      descriptor.value,
    );
    return descriptor;
  };
}

// 参数装饰器
export function RpcParam(
  options: RpcParamOptions | string,
): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    // 将字符串转换为选项对象
    const paramOptions =
      typeof options === 'string' ? { name: options } : options;

    // 获取当前方法已有的参数映射
    const existingParams =
      Reflect.getMetadata(RPC_PARAMS_METADATA, target, propertyKey) || {};

    // 添加新的参数映射
    existingParams[parameterIndex] = paramOptions;

    // 保存更新后的参数映射
    Reflect.defineMetadata(
      RPC_PARAMS_METADATA,
      existingParams,
      target,
      propertyKey,
    );
  };
}
