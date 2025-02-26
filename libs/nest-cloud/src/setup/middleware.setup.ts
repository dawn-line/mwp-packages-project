import { SetupStrategy } from './setup.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

export class MiddlewareStrategy extends SetupStrategy {
  async execute(): Promise<void> {
     // cors配置
    if (this.configService.isConfig('cors')) {
      const corsConfig = this.configService.get('cors');
      this.app.enableCors(corsConfig);
    }

    // cookie解析
    // if (this.configService.isConfig('cookie')) {
    //   this.app.use(cookieParser(this.configService.get('cookie.secret')));
    // }
    this.app.use(cookieParser());
  }
}
