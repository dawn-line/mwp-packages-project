import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService, ErrorResult } from '@cs/nest-common';
import { ConfigService } from '@cs/nest-config';
import { RpcException } from '../../rpc';
@Catch()
export class UnifiedExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  private isHttpException(exception: unknown): exception is HttpException {
    return (
      exception instanceof HttpException ||
      (exception?.constructor?.name === 'HttpException' &&
        typeof (exception as any).getStatus === 'function')
    );
  }

  private getErrorMessage(exceptionResponse: string | object): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as any).message;
      return Array.isArray(message) ? message[0] : message;
    }
    return 'Internal server error';
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // 获取配置
    const config = this.configService.get('exceptionFilter');
    const includeStack = config?.stack?.response || false;

    // console.log('isRpcException', exception instanceof RpcException);
    // console.log('isHttpException', this.isHttpException(exception));
    // console.log('isError', exception instanceof Error);
    // 处理 RPC 异常
    if (exception instanceof RpcException) {
      // 记录错误日志
      this.logger.error(
        {
          jsonrpc: '2.0',
          error: {
            code: exception.code,
            message: exception.message,
            data: {
              type: 'RPC_ERROR',
              method: request.body?.method,
              params: request.body?.params,
              ...exception.data,
              ...(includeStack ? { stack: exception.stack } : {}),
            },
            id: null,
          },
        },
        'RpcExceptionFilter',
      );

      // RPC 响应始终返回 200
      const errorResponse = {
        jsonrpc: '2.0',
        error: {
          code: exception.code,
          message: exception.message,
          data: {
            ...exception.data,
            // 只在配置允许时添加堆栈信息，并且放在 data 字段中
            ...(includeStack ? { stack: exception.stack } : {}),
          },
        },
        // id: request.body?.id || null,
        id: null,
      };

      return response.status(HttpStatus.OK).json(errorResponse);
    }

    // 处理 HTTP 异常
    if (this.isHttpException(exception)) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理重定向
      if (
        status === HttpStatus.FOUND &&
        typeof exceptionResponse === 'object' &&
        'redirectUrl' in exceptionResponse
      ) {
        return response.redirect((exceptionResponse as any).redirectUrl);
      }

      const errorResponse: ErrorResult = {
        code: status,
        message: this.getErrorMessage(exceptionResponse),
        path: request.url,
        timestamp: new Date().toISOString(),
      };

      if (includeStack) {
        errorResponse.stack = exception.stack;
      }

      // 记录错误日志
      if (config?.stack?.logger) {
        this.logger.error(
          {
            ...errorResponse,
            stack: exception.stack,
          },
          'HttpExceptionFilter',
        );
      } else {
        this.logger.error(errorResponse, 'HttpExceptionFilter');
      }
      return response.status(status).json(errorResponse);
    }

    // 处理其他未知异常
    const errorResponse: ErrorResult = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (includeStack && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    // 记录错误日志
    if (config?.stack?.logger) {
      this.logger.error(
        {
          ...errorResponse,
          stack: exception instanceof Error ? exception.stack : undefined,
        },
        'ExceptionFilter',
      );
    } else {
      this.logger.error(errorResponse, 'ExceptionFilter');
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse);
  }
}
