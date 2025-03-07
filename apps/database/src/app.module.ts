import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@cs/nest-typeorm';
import { ConfigService, ConfigModule } from '@cs/nest-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShareModule } from './share.moudle';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { Role } from './modules/role/role.entity';
@Module({
  imports: [
    ShareModule,
    RoleModule,
    UserModule,
    // DatabaseModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const mysqlConfig = configService.get('mysql');
    //     return mysqlConfig.test;
    //   },
    // }),
    // DatabaseModule.forRoot({
    //   test: {
    //     name: 'test',
    //     type: 'mysql',
    //     host: '192.168.5.125',
    //     port: 3306,
    //     username: 'root',
    //     password: 'a1234567.',
    //     database: 'test',
    //     synchronize: true,
    //     logging: true,
    //   },
    //   test1: {
    //     name: 'test1',
    //     type: 'mysql',
    //     host: '192.168.5.125',
    //     port: 3306,
    //     username: 'root',
    //     password: 'a1234567.',
    //     database: 'test1',
    //     synchronize: true,
    //     logging: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
