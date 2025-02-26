import { Global } from '@nestjs/common';
import { CSModule } from '@cs/nest-cloud';
import { RedisModule } from '@cs/nest-redis';
import { ConfigService } from '@cs/nest-config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          ...config.get('redis'),
        };
      },
    }),
  ],
  exports: [RedisModule],
})
export class ShareModule {}
