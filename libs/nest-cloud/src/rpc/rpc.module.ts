import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import {
  RpcModuleOptions,
  RpcModuleAsyncOptions,
  RPC_MODULE_OPTIONS,
} from './rpc.interface';
import { RpcController } from './rpc.controller';
import { RpcRegistry } from './rpc.registry';
import { RpcClient } from './rpc.client';

@Module({})
export class RpcModule {
  static forRoot(options: RpcModuleOptions, isGlobal = false): DynamicModule {
    return {
      global: isGlobal,
      module: RpcModule,
      imports: [DiscoveryModule],
      providers: [
        RpcRegistry,
        RpcClient,
        {
          provide: RPC_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      controllers: [RpcController],
      exports: [RPC_MODULE_OPTIONS, RpcRegistry, RpcClient], // 导出 RpcRegistry
    };
  }

  static forRootAsync(
    options: RpcModuleAsyncOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      global: isGlobal,
      module: RpcModule,
      imports: [...(options.imports || []), DiscoveryModule],
      providers: [
        RpcRegistry,
        RpcClient,
        {
          provide: RPC_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      controllers: [RpcController],
      exports: [RPC_MODULE_OPTIONS, RpcRegistry, RpcClient],
    };
  }
}
