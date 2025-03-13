import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigOptions } from '@cs/nest-config';
import { LoggerModule } from '@cs/nest-common';
import { RpcModule } from './rpc/rpc.module';
export function CSModule(
  sharedMetaData: ModuleMetadata,
  configOption?: ConfigOptions,
): ClassDecorator {
  // 先通过获取配置 之后选择性加载相关模块
  const metadata: ModuleMetadata = {
    imports: [
      ConfigModule.forRoot(
        Object.assign(
          {
            configFilePath: './dist/config.yaml',
            onlyLocal: false,
            configFrom: 'nacos',
          },
          configOption || {},
        ),
      ),
      LoggerModule.forRootAsync(
        {
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            return {
              ...config.get('logger'),
            };
          },
        },
        true,
      ),
      RpcModule.forRootAsync(
        {
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            return {
              ...config.get('rpc'),
            };
          },
        },
        true,
      ),
    ],
    providers: [],
    controllers: [],
    exports: [LoggerModule, RpcModule, ConfigModule],
  };

  for (const key in sharedMetaData) {
    metadata[key].push(...sharedMetaData[key]);
  }
  // 调用原始 @Module 装饰器，并返回其结果
  return Module(metadata);
}
