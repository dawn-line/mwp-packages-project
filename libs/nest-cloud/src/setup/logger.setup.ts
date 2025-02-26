import { SetupStrategy } from './setup.interface';
import { LoggerService, CommonUtil } from '@cs/nest-common';
export class LoggerConfigStrategy extends SetupStrategy {
  async execute(): Promise<void> {
    // 使用自定义日志
    const logger = this.app.get(LoggerService);
    this.app.useLogger(logger);

    // 根据Console配置设置日志输出
    if (this.configService.isConfig('disableConsole')) {
      // 禁用console
      CommonUtil.disableConsole();
    }
  }
}
