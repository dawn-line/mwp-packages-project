import { Injectable, Optional, Inject } from '@nestjs/common';
import { HTTP_MODULE_OPTIONS } from './http.constants';
import { HttpModuleOptions, AxiosRequestInterceptors } from './http.interface';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
@Injectable()
export class HttpService {
  private $http: AxiosInstance;
  private interceptors: AxiosRequestInterceptors;
  constructor(
    @Optional()
    @Inject(HTTP_MODULE_OPTIONS)
    protected options: HttpModuleOptions,
  ) {
    // 初始化实例
    this.$http = axios.create(options);
    this.interceptors = options.interceptors;
    // 全局拦截 请求拦截器
    this.$http.interceptors.request.use(
      function (config: HttpModuleOptions) {
        // 处理header
        if (options.debugAuth) {
          Object.assign(config.headers, {
            'Content-Type': 'application/json',
            'x-service-endpoint': '1',
          });
        }
        return config;
      },
      function (err: any) {
        return Promise.reject(err);
      },
    );
    // 响应拦截器
    this.$http.interceptors.response.use(
      function (res: any) {
        return res;
      },
      function (err: any) {
        return Promise.reject(err);
      },
    );
  }

  /**
   * 发起请求
   * @param config axios配置信息
   * @returns 返回结果
   */
  request<T>(config: HttpModuleOptions<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // 请求拦截设置位置
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      this.$http
        .request<any, T>(config)
        .then((res: T) => {
          // 响应拦截设置位置
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * get请求
   * @param url 请求地址
   * @param config 配置
   * @returns 返回结果
   */
  get<T = any>(url: string, config?: AxiosRequestConfig<T>): Promise<T> {
    return this.request<T>({
      url,
      ...config,
      method: 'GET',
    });
  }

  /**
   * post请求
   * @param url 请求地址
   * @param data body参数
   * @param config 配置
   * @returns 返回结果
   */
  post<T = any>(
    url: string,
    data: object,
    config?: AxiosRequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      ...config,
      data,
      method: 'POST',
    });
  }

  /**
   * put请求
   * @param url 请求地址
   * @param data body参数
   * @param config 配置
   * @returns 返回结果
   */
  put<T = any>(
    url: string,
    data: object,
    config?: AxiosRequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      ...config,
      data,
      method: 'PUT',
    });
  }

  /**
   * delete请求
   * @param url 请求地址
   * @param data body参数
   * @param config 配置
   * @returns 返回结果
   */
  delete<T = any>(
    url: string,
    data: object,
    config?: AxiosRequestConfig<T>,
  ): Promise<T> {
    return this.request<T>({
      url,
      ...config,
      data: data,
      method: 'DELETE',
    });
  }
}
