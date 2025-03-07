import { Global } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { CSModule } from '@cs/nest-cloud';
import { ConfigService } from '@cs/nest-config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Role } from './modules/role/role.entity';
@Global()
@CSModule({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'test',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(111, config.get('mysql')[0]);
        return {
          ...config.get('mysql').test,
          entities: [User],
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'test1',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(222, config.get('mysql'));
        return {
          ...config.get('mysql').test1,
          entities: [Role],
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class ShareModule {}
