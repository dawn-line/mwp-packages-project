import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { QueryConditionInput } from '@cs/nest-common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() roleData: Partial<Role>) {
    const result = await this.roleService.createRole(roleData);
    return { success: result > 0, affectedRows: result };
  }

  @Post('findMany')
  async findMany(@Body() queryCondition: QueryConditionInput) {
    const result = await this.roleService.findManyBase(queryCondition);
    return result;
  }


  @Get()
  async findAll() {
    return this.roleService.findAllEnabledRoles();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne({ id });
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.roleService.findRoleByCode(code);
  }

  @Post('updateRole')
  async update(@Body() dto: any) {
    const result = await this.roleService.updateRole(
      dto.condition,
      dto.roleData,
    );
    return { success: result > 0, affectedRows: result };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.roleService.deleteRole(id);
    return { success: result > 0, affectedRows: result };
  }

  @Post('batch')
  async createMultiple(@Body() rolesData: Partial<Role>[]) {
    const result = await this.roleService.batchCreateRoles(rolesData);
    return { success: result > 0, affectedRows: result };
  }
}
