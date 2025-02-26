import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class UserDto {
  @ApiProperty()
  userId: bigint;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  realName: string;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}

export class LoginDto {
  @IsString()
  userName?: string;
  @IsString()
  varifyCode?: string;
  @IsString()
  password?: string;
  @IsString()
  captchaId?: string;
  @IsString()
  phoneNumber?: string;
  @IsString()
  flag?: LoginType;
  @IsString()
  service?: string;
}

export class UserIdDto {
  @IsNotEmpty()
  userId: bigint;
}

// 定义枚举类型
export enum LoginType {
  SMS = 'SMS',
  PASSWORD = 'PASSWORD',
}
