import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@cs/nest-typeorm';
import { ConfigService } from '@cs/nest-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share.moudle';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { Role } from './modules/role/role.entity';
@Module({
  imports: [
    // DatabaseModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     console.log(config.get('mysql'));
    //     return {
    //       connections: config.get('mysql'),
    //     };
    //   },
    // }),
    // TypeOrmModule.forRootAsync({
    //   name: 'test',
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     console.log(111, config.get('mysql')[0]);
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
    //     console.log(222, config.get('mysql'));
    //     return {
    //       ...config.get('mysql').test1,
    //       entities: [Role],
    //     };
    //   },
    // }),
    ShareModule,
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
