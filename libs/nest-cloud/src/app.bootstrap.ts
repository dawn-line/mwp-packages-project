import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@cs/nest-config';
import { configStrategyMap } from './setup';

type AsyncFunction = (app: any, config: ConfigService) => Promise<any>;

export async function bootstrap(
  rootModule: any, // 加载根模块
  appStartedCall?: AsyncFunction, // 启动中间回调
) {
  // 初始化应用对象
  const app = await NestFactory.create<NestExpressApplication>(rootModule, {
    bufferLogs: true,
  });

  // 获取配置 根据配置加载对象
  const configService = app.get(ConfigService);

  // 根据配置策略启动相关设置
  for (const key of Object.keys(configStrategyMap)) {
    const strategy = new configStrategyMap[key](app, configService);
    await strategy.execute();
  }

  // 启动回调函数
  if (appStartedCall) {
    await appStartedCall(app, configService);
  }
}
