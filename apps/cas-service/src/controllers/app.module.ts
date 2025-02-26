import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share.module';
import { CasServerModule } from './module/cas.module';

@Module({
  imports: [CasServerModule, ShareModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ShareModule],
})
export class AppModule {}
