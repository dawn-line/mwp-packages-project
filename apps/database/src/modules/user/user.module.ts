import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { registerEntity } from '@cs/nest-typeorm';

// 注册用户实体到test连接
registerEntity('test', UserEntity);

@Module({
  providers: [
    // 提供用户仓库和服务
    UserRepository,
    UserService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
