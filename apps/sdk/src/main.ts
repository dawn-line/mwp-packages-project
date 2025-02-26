import { bootstrap } from '@cs/nest-cloud';
import { SdkModule } from './sdk.module';
bootstrap(SdkModule, async (app, config) => {
  // 服务启动后可以干点事情
  const conf = config.get('name');
  console.log('我启动了，当前服务是：', conf);
});
