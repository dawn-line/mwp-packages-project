import { Global } from '@nestjs/common';
import { CSModule } from '@cs/nest-cloud';
import { RedisModule } from '@cs/nest-redis';
import { ConfigService } from '@cs/nest-config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Global()
@CSModule({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          ...config.get('redis'),
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist'),
      useGlobalPrefix: true,
      exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
  ],
  exports: [RedisModule],
})
export class ShareModule {}
