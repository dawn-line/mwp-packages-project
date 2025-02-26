import { SetupStrategy } from './setup.interface';
import * as bodyParser from 'body-parser';

export class BodyParserStrategy extends SetupStrategy {
  async execute(): Promise<void> {
     // 设置服务请求参数题解析
    if (this.configService.isConfig('bodyParser')) {
      const bodyParserConfig = this.configService.get('bodyParser');
      for (const key in bodyParserConfig) {
        if (bodyParserConfig[key]) {
          this.app.use(bodyParser[key](bodyParserConfig[key]));
        }
      }
    }
  }
}
