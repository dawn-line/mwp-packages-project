import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Result,
  EHttpStatus,
  SKIP_TRANSFORM_INTERCEPTOR,
} from '@cs/nest-common';
import { isObject } from 'class-validator';

@Injectable()
export class TransformInterceptor<T extends Record<string, any>>
  implements NestInterceptor<T, Result<T>>
{
  private readonly reflector = new Reflector();
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Result<T>> {
    const isSkipIntercept = this.reflector.get<boolean>(
      SKIP_TRANSFORM_INTERCEPTOR,
      context.getHandler(),
    );

    // 跳过拦截器
    if (isSkipIntercept) {
      return next.handle().pipe(map((data: any) => data));
    }
    const request = context.switchToHttp().getRequest();
    // 检查请求头中是否包含 RPC 标识
    const isRpcRequest = request.headers['x-rpc-request'] === 'true';
    if (isRpcRequest) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: T) => {
        let message = '';
        if (isObject(data)) {
          message = (data as any).message;
        }
        const result: Result<T> = {
          code: response.statusCode,
          status: EHttpStatus.Success,
          message,
          result: data !== undefined ? data : null,
        };
        return result;
      }),
    );
  }
}
