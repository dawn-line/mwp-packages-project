import { Module } from '@nestjs/common';
import { DatabaseModule } from '@cs/nest-typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
@Module({
  imports: [
    DatabaseModule.forFeatures([{ connectionName: 'test1', entities: [Role] }]),
  ],
  providers: [RoleService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
