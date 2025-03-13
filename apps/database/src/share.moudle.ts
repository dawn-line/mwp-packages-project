import { Global } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { CSModule } from '@cs/nest-cloud';
import { ConfigService } from '@cs/nest-config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/user.entity';
import { Role } from './modules/role/role.entity';
@Global()
@CSModule({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   name: 'test',
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       ...config.get('mysql').test,
    //       entities: [User],
    //     };
    //   },
    // }),
    // TypeOrmModule.forRootAsync({
    //   name: 'test1',
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       ...config.get('mysql').test1,
    //       entities: [Role],
    //     };
    //   },
    // }),
    // DatabaseModule.forRoot({
    //   test: {
    //     type: 'mysql',
    //     host: 'rm-mwp-pre-inner.mysql.rds.aliyuncs.com',
    //     port: 3306,
    //     username: 'yearrow_pre_root',
    //     password: 'ylkj88227793@@@!',
    //     database: 'test',
    //     synchronize: true,
    //     logging: true,
    //   },
    //   test1: {
    //     type: 'mysql',
    //     host: 'rm-mwp-pre-inner.mysql.rds.aliyuncs.com',
    //     port: 3306,
    //     username: 'yearrow_pre_root',
    //     password: 'ylkj88227793@@@!',
    //     database: 'test1',
    //     synchronize: true,
    //     logging: true,
    //   },
    // })
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
