import { CSModule } from '@cs/nest-cloud';
import { CasClientMiddleware } from '@cs/nest-cas-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ShareModule } from './share.module';
@CSModule({
  imports: [ShareModule],
  providers: [AppService],
  controllers: [AppController],
  exports: [ShareModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CasClientMiddleware).forRoutes('/*');
  }
}
