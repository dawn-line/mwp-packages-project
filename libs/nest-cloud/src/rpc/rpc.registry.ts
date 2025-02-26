import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  RPC_SERVICE_METADATA,
  RPC_METHOD_METADATA,
  RPC_PARAMS_METADATA,
} from './rpc.interface';
import {
  RpcException,
  RpcInvalidParamsException,
  RpcMethodNotFoundException,
  RpcInternalException,
} from './rpc.errors';

// 定义服务信息接口
export interface RpcServiceInfo {
  name: string;
  description?: string;
  methods: RpcMethodInfo[];
}

// 定义方法信息接口
export interface RpcMethodInfo {
  name: string;
  description?: string;
  returnType?: string;
  returnDescription?: string;
  parameters: RpcParameterInfo[];
  fullName: string; // 服务名.方法名
}

// 定义参数信息接口
export interface RpcParameterInfo {
  name: string;
  description?: string;
  type?: string;
  required?: boolean;
  defaultValue?: any;
  position: number;
}

@Injectable()
export class RpcRegistry implements OnModuleInit {
  private rpcMethods: Map<
    string,
    {
      instance: any;
      methodName: string;
      methodInfo: RpcMethodInfo;
    }
  > = new Map();

  private servicesInfo: Map<string, RpcServiceInfo> = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (!instance) return;

      // 获取服务元数据
      const serviceOptions = Reflect.getMetadata(
        RPC_SERVICE_METADATA,
        instance.constructor,
      );
      if (!serviceOptions) return;

      // 创建服务信息
      const serviceName = serviceOptions.name;
      const serviceInfo: RpcServiceInfo = {
        name: serviceName,
        description: serviceOptions.description,
        methods: [],
      };

      this.servicesInfo.set(serviceName, serviceInfo);

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (methodName: string) => {
          // 获取方法的实际引用
          const method = instance[methodName];
          // 从方法本身获取元数据
          const methodMeta = Reflect.getMetadata(RPC_METHOD_METADATA, method);

          // console.log(`Scanning method ${methodName}:`, methodMeta);

          if (methodMeta) {
            const fullMethodName = `${serviceName}.${methodName}`;
            // 获取参数信息
            const prototype = Object.getPrototypeOf(instance);
            const paramMappings =
              Reflect.getMetadata(RPC_PARAMS_METADATA, prototype, methodName) ||
              {};

            // 构建参数信息数组
            const parametersInfo: RpcParameterInfo[] = [];
            for (const [index, options] of Object.entries(paramMappings)) {
              const paramIndex = Number(index);
              parametersInfo.push({
                ...(options as any),
                position: paramIndex,
              });
            }

            // 排序参数（按位置）
            parametersInfo.sort((a, b) => a.position - b.position);

            // 创建方法信息
            const methodInfo: RpcMethodInfo = {
              name: methodMeta.name,
              description: methodMeta.description,
              returnType: methodMeta.returnType,
              returnDescription: methodMeta.returnDescription,
              parameters: parametersInfo,
              fullName: fullMethodName,
            };

            // 存储方法信息
            serviceInfo.methods.push(methodInfo);

            // 存储到执行映射中
            this.rpcMethods.set(fullMethodName, {
              instance,
              methodName,
              methodInfo,
            });
          }
        },
      );
    });
  }

  // private getParameterNames(func: (...args: any[]) => any): string[] {
  //   const funcStr = func.toString();
  //   const paramStr = funcStr.slice(
  //     funcStr.indexOf('(') + 1,
  //     funcStr.indexOf(')'),
  //   );
  //   return paramStr
  //     .split(',')
  //     .map((param) => param.trim())
  //     .filter((param) => param.length > 0);
  // }

  async executeMethod(method: string, params: any): Promise<any> {
    const methodData = this.rpcMethods.get(method);
    if (!methodData) {
      throw new RpcMethodNotFoundException(method);
    }
    const { instance, methodName, methodInfo } = methodData;
    try {
      // 根据参数类型处理参数、
      const args = this.buildMethodArguments(params, methodInfo);
      // console.log('参数输出', params, methodInfo, ...args);
      const result = instance[methodName](...args);
      // 检查返回值是否是 Promise
      if (result && typeof result.then === 'function') {
        return await result; // 如果是 Promise，等待它完成
      }
      return result; // 如果不是 Promise，直接返回
    } catch (error) {
      // 如果已经是 RpcException，直接抛出
      if (error instanceof RpcException) {
        throw error;
      }

      // 参数错误
      if (
        error.message?.includes('Invalid parameters') ||
        error.message?.includes('Type error')
      ) {
        throw new RpcInvalidParamsException(error.message);
      }

      // 其他错误作为内部错误
      throw new RpcInternalException('Method execution failed', {
        originalError: error.message,
        stack: error.stack,
      });
    }
  }

  private buildMethodArguments(params: any, methodInfo: RpcMethodInfo): any[] {
    try {
      // 处理空参数
      if (params === null || params === undefined) {
        // 检查必需参数
        const requiredParam = methodInfo.parameters.find((p) => p.required);
        if (requiredParam) {
          throw new Error(`Missing required parameter: ${requiredParam.name}`);
        }
        return [];
      }

      // 处理数组参数
      if (Array.isArray(params)) {
        if (params.length > methodInfo.parameters.length) {
          throw new Error('Too many parameters provided');
        }

        // 创建完整参数数组
        const args = [...params];

        // 检查必需参数是否都提供了
        for (let i = params.length; i < methodInfo.parameters.length; i++) {
          const param = methodInfo.parameters[i];
          if (param.required) {
            throw new Error(`Missing required parameter: ${param.name}`);
          }
          // 使用默认值填充剩余参数
          if ('defaultValue' in param) {
            args[i] = param.defaultValue;
          }
        }

        return args;
      }

      // 处理对象参数
      if (typeof params === 'object') {
        // 创建按参数位置排序的数组
        const args = Array(methodInfo.parameters.length).fill(undefined);

        // 按照参数名称填充参数值
        for (const param of methodInfo.parameters) {
          if (param.name in params) {
            args[param.position] = params[param.name];
          } else if (param.required) {
            throw new Error(`Missing required parameter: ${param.name}`);
          } else if ('defaultValue' in param) {
            args[param.position] = param.defaultValue;
          }
        }

        return args;
      }

      // 处理单一参数
      if (methodInfo.parameters.length === 0) {
        throw new Error('No parameters expected but received one');
      }

      return [params];
    } catch (error) {
      throw new RpcInvalidParamsException(error.message);
    }
  }
  getMethods(): string[] {
    return Array.from(this.rpcMethods.keys());
  }

  // 获取完整服务信息
  getServicesInfo(): RpcServiceInfo[] {
    return Array.from(this.servicesInfo.values());
  }
}
