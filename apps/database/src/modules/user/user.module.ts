import { Module } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
@Module({
  imports: [
    DatabaseModule.forFeatures([{ connectionName: 'test', entities: [User] }]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
