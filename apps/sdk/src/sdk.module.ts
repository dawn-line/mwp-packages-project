import { Module } from '@nestjs/common';
import { ShareModule } from './share.moudle';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
@Module({
  imports: [ShareModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
