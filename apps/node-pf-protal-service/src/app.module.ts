import { CSModule } from '@cs/nest-cloud';
import { CasClientModule } from '@cs/nest-cas-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@CSModule({
  imports: [
    CasClientModule.footRoot({
      // casServerUrl: 'https://192.168.5.126:8443/cas',
      casServerUrl: 'http://192.168.5.90:8080/cas', //cas服务登录地址
      casServiceValidateUrl: 'http://192.168.5.90:3002/casServer', // cas服务验证地址
      serviceUrl: 'http://192.168.5.90:3003', // 擦拭服务成功回调地址
      sessionName: 'casuser',
      rejectUnauthorized: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
