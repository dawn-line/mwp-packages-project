import { Injectable, Inject, Logger } from '@nestjs/common';
import { JsonRpcClient } from './json-rpc/client';
import { Host } from 'nacos';
import { RPC_MODULE_OPTIONS, RpcConfig } from './rpc.interface';
import { JsonRpcResponse } from './json-rpc/types';
import { RpcModuleOptions, RpcRequestClient } from './rpc.interface';
import { RpcInternalException, RpcException } from './rpc.errors';
import { NacosNaming } from '../nacos.naming';
@Injectable()
export class RpcClient {
  private client: JsonRpcClient;
  private nacosNaming: NacosNaming;
  private readonly logger = new Logger('RpcService');
  constructor(
    @Inject(RPC_MODULE_OPTIONS)
    private readonly options: RpcModuleOptions,
  ) {
    this.client = new JsonRpcClient({
      protocol: options.protocol,
      timeout: options.timeout || 60000,
    });

    // 获取nacos实例
    this.nacosNaming = this.initNacosNaming();
  }
  async call(request: RpcRequestClient): Promise<JsonRpcResponse | void> {
    const { rpcConfig, payload, reqOptions } = request;
    const instance = await this.getHealthyInstance(rpcConfig);
    let url = `${this.options.protocol}://${instance.ip}:${instance.port}`;
    if (rpcConfig.servicePath) {
      url += `/${rpcConfig.servicePath}/rpc`;
    } else {
      url += '/rpc';
    }
    try {
      return this.client.call(
        {
          url,
          req: payload,
        },
        reqOptions,
      );
    } catch (error) {
      // 已经是 RpcException 的错误直接抛出
      if (error instanceof RpcException) {
        throw error;
      }
      // 其他错误转换为内部错误
      throw new RpcInternalException('Failed to call RPC service', {
        originalError: error.message,
        stack: error.stack,
      });
    }
  }

  private initNacosNaming(): NacosNaming {
    // 实例化nacosNaming
    const nacosName = process.env.CS_NACOSNAME;
    const nacosPassword = process.env.CS_NACOSPASSWORD;
    const namespace = process.env.CS_SERVICEENV;
    const nacosServerIp = process.env.CS_NACOSSERVERIP;
    return NacosNaming.getInstance({
      logger: console,
      serverList: nacosServerIp, // 域名
      namespace: namespace, //从环境中获取配置
      username: nacosName,
      password: nacosPassword,
    });
  }

  private async getHealthyInstance(config: RpcConfig): Promise<Host> {
    try {
      const instance = await this.nacosNaming.selectOneHealthyInstance(
        config.serviceName,
        config.groupName,
        config.clusters,
      );

      if (!instance) {
        throw new Error(
          `No healthy instance found for service: ${config.serviceName}`,
        );
      }
      return instance;
    } catch (error) {
      throw new Error(`Failed to get healthy instance: ${error.message}`);
    }
  }
}
