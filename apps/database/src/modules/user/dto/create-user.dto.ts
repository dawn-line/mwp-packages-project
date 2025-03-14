import { IsNotEmpty, IsEmail, IsOptional, IsString, Length, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50之间' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 100, { message: '密码长度必须在6-100之间' })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  @Length(5, 20, { message: '手机号长度不正确' })
  mobile?: string;

  @IsOptional()
  @IsString({ message: '真实姓名必须是字符串' })
  realName?: string;

  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsEnum([0, 1], { message: '状态值必须是0或1' })
  status?: number;

  @IsOptional()
  @IsString({ message: '部门ID必须是字符串' })
  deptId?: string;
}
