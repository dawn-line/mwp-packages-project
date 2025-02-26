import { SetupStrategy } from './setup.interface';
import { setupSwagger } from '@cs/nest-common';
export class SwaggerStrategy extends SetupStrategy {
  async execute(): Promise<void> {
    // 加载文档
    const serverPrefix = this.configService.get('serverPath');
    if (this.configService.isConfig('serverPath')) {
      this.app.setGlobalPrefix(serverPrefix);
    }
    const docsPath = serverPrefix ? `${serverPrefix}/docs` : 'docs';
    if (this.configService.isConfig('docs')) {
      // 添加前缀
      const docsConfig = this.configService.get('docs');
      docsConfig.serverPrefix = serverPrefix;
      setupSwagger(this.app, docsPath, docsConfig);
    }
  }
}
