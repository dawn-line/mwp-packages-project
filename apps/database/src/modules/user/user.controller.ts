import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: Partial<User>) {
    const result = await this.userService.createUser(userData);
    return { success: result > 0, affectedRows: result };
  }

  @Get()
  async findAll() {
    return this.userService.findActiveUsers();
  }

  @Get('sql')
  async findBySql() {
    return this.userService.findActiveUsersBySQL();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    const result = await this.userService.updateByCondition(userData, { id });
    return { success: result > 0, affectedRows: result };
  }

  @Put(':id/disable')
  async disable(@Param('id') id: string) {
    const result = await this.userService.disableUser(id);
    return { success: result > 0, affectedRows: result };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    return { success: result > 0, affectedRows: result };
  }

  @Post('batch')
  async createMultiple(@Body() usersData: Partial<User>[]) {
    const result = await this.userService.createMultipleUsers(usersData);
    return { success: result > 0, affectedRows: result };
  }
}
