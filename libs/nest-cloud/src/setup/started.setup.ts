import { SetupStrategy } from './setup.interface';
import { registerService } from '../nacos.naming';
import { LoggerService } from '@cs/nest-common';
export class StartedStrategy extends SetupStrategy {
  async execute(): Promise<void> {
    // 服务启动相关程序
    // 设置服务访问路径
    const serverPrefix = this.configService.get('serverPath');
    // 启动服务
    const logger = this.app.get(LoggerService);
    const docsPath = serverPrefix ? `${serverPrefix}/docs` : 'docs';
    if (Number(process.env.CS_PORT) > 0) {
      await this.app.listen(Number(process.env.CS_PORT));

      let startOutput = `\n- service ${
        process.env.CS_NAME
      } is ready now! \n- service access address: http://${process.env.CS_HOST}:${Number(
        process.env.CS_PORT,
      )}/${process.env.CS_SERVERPATH} \n`;

      if (this.configService.isConfig('docs')) {
        startOutput += `- service document access address: http://${
          process.env.CS_HOST
        }:${Number(process.env.CS_PORT)}/${docsPath}`;
      }
      logger.log(startOutput);
    } else {
      logger.error('service start port not specified!');
    }

    // 注册到服务注册中心
    if (this.configService.isConfig('naming')) {
      await registerService();
    }
  }
}
