import { Global } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { CSModule } from '@cs/nest-cloud';
import { ConfigService } from '@cs/nest-config';

@Global()
@CSModule({
  imports: [
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          ...config.get('mysql'),
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class ShareModule {}
