import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Result } from '@cs/nest-common';
export declare class TransformInterceptor<T extends Record<string, any>> implements NestInterceptor<T, Result<T>> {
    private readonly reflector;
    intercept(context: ExecutionContext, next: CallHandler): Observable<Result<T>>;
}
//# sourceMappingURL=transform.interceptor.d.ts.map