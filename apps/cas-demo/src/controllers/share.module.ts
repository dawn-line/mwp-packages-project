import { Global } from '@nestjs/common';
import { CSModule } from '@cs/nest-cloud';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CasClientModule } from '@cs/nest-cas-client';
@Global()
@CSModule({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist'),
      useGlobalPrefix: true,
      serveStaticOptions: {
        fallthrough: true, // 改为true，允许未找到文件时继续到下一个处理器
      },
    }),
    CasClientModule.forRoot({
      // casServerUrl: 'https://192.168.5.126:8443/cas',
      casServerUrl: 'http://192.168.5.41:3002/cas',
      casServiceValidateUrl: 'http://192.168.5.41:3002/cas',
      serviceUrl: 'http://192.168.5.41:3003/casDemoServer', // 注意这里要加上serverPath
      sessionServiceUrl: 'http://192.168.5.41:3005/sessionServer',
      rejectUnauthorized: false,
    }),
  ],
  exports: [],
})
export class ShareModule {}
