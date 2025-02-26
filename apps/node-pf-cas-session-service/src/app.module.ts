import { Module } from '@nestjs/common';
import { CasSessionService } from './app.service';
import { ShareModule } from './share.module';
@Module({
  imports: [ShareModule],
  providers: [CasSessionService],
  exports: [ShareModule],
})
export class AppModule {}
