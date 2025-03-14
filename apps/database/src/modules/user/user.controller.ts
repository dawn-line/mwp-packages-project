import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UpdateUserDto, LoginDto, QueryUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   */
  @Post()
  async createUser(@Body() userData: Partial<UserEntity>) {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取用户详情
   */
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * 更新用户信息
   */
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    try {
      const affected = await this.userService.updateUser(id, userData);
      if (affected === 0) {
        throw new HttpException('用户不存在或无需更新', HttpStatus.NOT_FOUND);
      }
      return { success: true, affected };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 删除用户（软删除）
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const affected = await this.userService.deleteUser(id);
    if (affected === 0) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return { success: true, affected };
  }

  /**
   * 更新用户状态
   */
  @Put(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: number,
  ) {
    const affected = await this.userService.updateUserStatus(id, status);
    if (affected === 0) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    return { success: true, affected };
  }

  /**
   * 搜索用户列表
   */
  @Get()
  async searchUsers(@Query() queryDto: QueryUserDto) {
    return this.userService.searchUsers(queryDto);
  }

  /**
   * 获取部门下的所有用户
   */
  @Get('by-dept/:deptId')
  async getUsersByDeptId(@Param('deptId') deptId: string) {
    return this.userService.getUsersByDeptId(deptId);
  }

  /**
   * 用户登录
   */
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const { username, password } = loginData;
    const user = await this.userService.validateUser(username, password);

    if (!user) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }

    // 剔除敏感信息
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 自定义SQL查询示例
   */
  @Get('custom-search')
  async customSearch(@Query('keyword') keyword = '') {
    return this.userService.executeCustomQuery(keyword);
  }
}
