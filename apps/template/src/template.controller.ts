import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { RpcClient } from '@cs/nest-cloud';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
// 定义 DTO 类
export class TestValidationDto {
  @IsString({ message: '名称必须是字符串' })
  @IsNotEmpty({ message: '名称不能为空' })
  @Length(2, 20, { message: '名称长度必须在2-20个字符之间' })
  name: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsOptional()
  email: string;

  @IsOptional()
  @IsNumber({}, { message: '年龄必须是数字' })
  @Min(0, { message: '年龄不能小于0' })
  @Max(120, { message: '年龄不能大于120' })
  age?: number;
}

@Controller()
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly rpcClient: RpcClient,
  ) {}

  @Get()
  getHello(): string {
    try {
      console.log('进入控制器');
      // 示例：处理可能的错误
      const result = this.templateService.getHello();
      if (!result) {
        throw new HttpException(
          '服务返回空结果',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return result;
    } catch (error) {
      // 统一错误处理
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        '服务器内部错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  add(@Body() body: TestValidationDto): string {
    console.log('进入控制器:', body);
    return this.templateService.getHello();
  }

  @Get('throw-http-exception')
  throwHttpException() {
    throw new HttpException('详细的错误信息', HttpStatus.BAD_REQUEST);
  }

  @Get('throw-error')
  throwError() {
    throw new Error('This is a regular error');
  }

  @Get('throw-unknown')
  throwUnknown() {
    throw {
      code: 'UNKNOWN_ERROR',
      message: 'This is an unknown error object',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('test-validation')
  testValidation(@Body() body: TestValidationDto) {
    console.log('进入控制器:', body);
    return this.templateService.getHello();
  }

  // 测试rpc方法
  @Get('test-rpc')
  async testRpc() {
    console.log('进入控制器:TEMPLATE');
    const response = await this.rpcClient.call({
      rpcConfig: {
        serviceName: 'node-pf-id-generation-service',
        servicePath: 'idGenerationServer',
      },
      payload: {
        method: 'id.createId',
        params: '',
      },
    });
    console.log('返回结果:', response);
    return false;
  }
}
