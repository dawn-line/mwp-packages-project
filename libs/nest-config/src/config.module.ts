import { DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_OPTIONS } from './config/constants';
import {
  ConfigOptions,
  ConfigAsyncOptions,
} from './config/config.schema.interface';
import { getRemoteConfig } from './config.utlis';

export class ConfigModule {
  static async forRoot(
    options: ConfigOptions,
    isGlobal = true,
  ): Promise<DynamicModule> {
    // 在这里执行异步操作获取配置
    const configData = await getRemoteConfig(options);

    // 使用获取的配置进行配置初始化
    const configService = new ConfigService(configData);
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
      global: isGlobal,
      exports: [ConfigService],
    };
  }
  // 从外部获取配置初始化
  static forRootAsync(
    options: ConfigAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return {
      module: ConfigModule,
      global: isGlobal,
      imports: options.imports,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ConfigService,
      ],
      exports: [ConfigService, CONFIG_OPTIONS],
    };
  }
}
