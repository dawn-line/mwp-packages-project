import { HttpModuleOptions } from './http.interface';
import { AxiosRequestConfig } from 'axios';
export declare class HttpService {
    protected options: HttpModuleOptions;
    private $http;
    private interceptors;
    constructor(options: HttpModuleOptions);
    request<T>(config: HttpModuleOptions<T>): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig<T>): Promise<T>;
    post<T = any>(url: string, data: object, config?: AxiosRequestConfig<T>): Promise<T>;
    put<T = any>(url: string, data: object, config?: AxiosRequestConfig<T>): Promise<T>;
    delete<T = any>(url: string, data: object, config?: AxiosRequestConfig<T>): Promise<T>;
}
//# sourceMappingURL=http.service.d.ts.map