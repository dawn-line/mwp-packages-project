import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { RegistModule, CustomRepository } from '@cs/nest-typeorm';
import { RoleEntity } from './role.entity';
import { ProductEntity } from './product.entity';
@Module({
  imports: [
    RegistModule.forRepositories([
      {
        entity: UserEntity,
        repository: UserRepository,
        connectionName: 'test',
      },
      {
        entity: ProductEntity,
        connectionName: 'test',
      },
      {
        entity: RoleEntity,
        connectionName: 'test1',
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
