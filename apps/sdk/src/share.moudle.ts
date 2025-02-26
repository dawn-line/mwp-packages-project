import { Global, Module } from '@nestjs/common';
import { CSModule } from '@cs/nest-cloud';

@Global()
@CSModule({
  imports: [],
  providers: [],
  exports: [],
})
export class ShareModule {}
