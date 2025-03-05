import { Global } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { CSModule } from '@cs/nest-cloud';

@Global()
@CSModule({
  imports: [
    // DatabaseModule.forRoot({
    //   connections: [
    //     {
    //       name: 'test',
    //       type: 'mysql',
    //       host: '192.168.5.125',
    //       port: 3306,
    //       username: 'root',
    //       password: 'a1234567.',
    //       database: 'test',
    //       synchronize: true,
    //       logging: true,
    //     },
    //     {
    //       name: 'test1',
    //       type: 'mysql',
    //       host: '192.168.5.125',
    //       port: 3306,
    //       username: 'root',
    //       password: 'a1234567.',
    //       database: 'test1',
    //       synchronize: true,
    //       logging: true,
    //     },
    //   ],
    // }),
  ],
  providers: [],
  exports: [],
})
export class ShareModule {}
