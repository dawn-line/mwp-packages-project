import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { RpcRegistry } from './rpc.registry';
import { JsonRpcRequest, JsonRpcResponse } from './json-rpc/types';
import { createJsonRpcSuccess, validateJsonRpcRequest } from './json-rpc/utils';
import { RpcServiceInfo } from './rpc.registry';
import {
  RpcException,
  RpcMethodNotFoundException,
  RpcInvalidParamsException,
  RpcInternalException,
} from './rpc.errors';

class JsonRpcRequestDto {
  @ApiProperty({
    description: 'JSON-RPC版本号',
    example: '2.0',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  jsonrpc: string;

  @ApiProperty({
    description: 'RPC方法名,<路径>.<方法>',
    example: 'service.method',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    description: '请求参数',
    example: { param1: 'value1', param2: 'value2' },
    required: false,
    type: Object,
  })
  @IsObject()
  @IsOptional()
  params?: any;

  @ApiProperty({
    description: '请求ID',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  id?: string | number | null;
}

// 定义响应DTO类
class JsonRpcResponseDto {
  @ApiProperty({
    description: 'JSON-RPC版本号',
    example: '2.0',
  })
  jsonrpc: string;

  @ApiProperty({
    description: '响应结果',
    example: { data: 'success' },
  })
  result?: any;

  @ApiProperty({
    description: '错误信息',
    example: {
      code: -32600,
      message: 'Invalid Request',
      data: { details: 'Invalid method parameter' },
    },
  })
  error?: {
    code: number;
    message: string;
    data?: any;
  };

  @ApiProperty({
    description: '请求ID',
    example: '1234567890',
  })
  id: string | number | null;
}

@Controller('rpc')
@ApiTags('rpc')
export class RpcController {
  constructor(private readonly rpcRegistry: RpcRegistry) {}

  @Post()
  @ApiOperation({
    summary: 'RPC 请求控制器',
    description:
      '处理JSON-RPC 2.0请求,支持方法调用和通知(使用postman等工具调试时，注意请求头部添加x-rpc-request: true标识头)',
  })
  @ApiBody({
    type: JsonRpcRequestDto,
    description: 'JSON-RPC 2.0请求对象',
  })
  @ApiResponse({
    status: 200,
    description: '成功返回RPC响应',
    type: JsonRpcResponseDto,
  })
  async handleRpcRequest(
    @Body()
    request: JsonRpcRequest,
  ): Promise<JsonRpcResponse | void> {
    // if (Array.isArray(request)) {
    //   return Promise.all(request.map((req) => this.handleSingleRequest(req)));
    // }
    // 请求参数验证
    validateJsonRpcRequest(request);
    return await this.handleSingleRequest(request);
  }

  private async handleSingleRequest(
    request: JsonRpcRequest,
  ): Promise<JsonRpcResponse> {
    const { method, params, id } = request;

    try {
      if (!method || typeof method !== 'string') {
        throw new RpcInvalidParamsException('Invalid method name');
      }

      const result = await this.rpcRegistry.executeMethod(method, params);
      return createJsonRpcSuccess(id, result);
    } catch (error) {
      // 已经是 RpcException 的错误直接抛出
      if (error instanceof RpcException) {
        throw error;
      }

      // 根据错误类型转换为对应的 RPC 异常
      if (error.message?.includes('Method not found')) {
        throw new RpcMethodNotFoundException(method);
      }

      if (
        error.message?.includes('Invalid parameters') ||
        error.message?.includes('Validation failed')
      ) {
        throw new RpcInvalidParamsException(error.message);
      }

      // 其他错误转换为内部错误
      throw new RpcInternalException('Internal error occurred', {
        originalError: error.message,
        stack: error.stack,
      });
    }
  }

  // @Get('/methods')
  // @ApiOperation({
  //   summary: 'RPC 方法列表',
  //   description: '获取已注册的RPC方法列表',
  // })
  // getRegisteredMethods(): string[] {
  //   return this.rpcRegistry.getMethods();
  // }

  @Get()
  @ApiOperation({
    summary: 'RPC服务文档信息',
    description: '获取已注册的RPC服务信息，查询测试使用',
  })
  getServicesInfo(): RpcServiceInfo[] {
    const services = this.rpcRegistry.getServicesInfo();

    // 这有助于调试
    // console.log('Services info:', JSON.stringify(services, null, 2));

    return services;
  }
}
