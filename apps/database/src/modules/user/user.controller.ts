import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: Partial<UserEntity>) {
    const result = await this.userService.create(user);
    return { success: result > 0, data: result };
  }

  @Post('batch')
  async createMany(@Body() users: Partial<UserEntity>[]) {
    const result = await this.userService.createMany(users);
    return { success: result > 0, data: result };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<UserEntity>) {
    const result = await this.userService.update(id, userData);
    return { success: result > 0, data: result };
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    const result = await this.userService.softDelete(id);
    return { success: result > 0, data: result };
  }

  @Delete(':id/hard')
  async hardDelete(@Param('id') id: string) {
    const result = await this.userService.hardDelete(id);
    return { success: result > 0, data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return { success: !!user, data: user };
  }

  @Get()
  async findAll(@Query() query: Partial<UserEntity>) {
    const users = await this.userService.findAll(query);
    return { success: true, data: users };
  }

  @Get('page')
  async findPage(@Query('page') page = 1, @Query('size') size = 10) {
    const result = await this.userService.findWithPagination(page, size);
    return { success: true, data: result };
  }
}
