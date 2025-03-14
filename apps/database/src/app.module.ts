import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share.moudle';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [ShareModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
