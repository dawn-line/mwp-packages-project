import { ModuleMetadata } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
export interface AxiosRequestInterceptors<T = AxiosResponse> {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestInterceptorCatch?: (error: any) => any;
    responseInterceptor?: (res: T) => T;
    responseInterceptorCatch?: (error: any) => any;
}
export interface HttpModuleOptions<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: AxiosRequestInterceptors<T>;
    debugAuth?: boolean;
    validateStatus?: ((status: number) => boolean) | null | undefined;
}
export interface HttpModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => HttpModuleOptions | Promise<HttpModuleOptions>;
    inject?: any[];
}
//# sourceMappingURL=http.interface.d.ts.map