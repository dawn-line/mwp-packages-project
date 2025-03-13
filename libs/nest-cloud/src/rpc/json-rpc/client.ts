// jsonRpcClient.ts

import {
  JsonRpcRequest,
  JsonRpcResponse,
  JSONRPCConfig,
  JsonRpcRequestClient,
} from './types';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class JsonRpcClient {
  private axiosInstance: AxiosInstance;
  constructor(private rpcConfig: JSONRPCConfig) {
    this.axiosInstance = axios.create({
      timeout: rpcConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'x-rpc-request': 'true',
      },
    });

    // this.axiosInstance.interceptors.request.use(
    //   (config) => {
    //     // 请求拦截
    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   },
    // );

    // this.axiosInstance.interceptors.response.use(
    //   (response) => {
    //     // 响应拦截
    //     return response;
    //   },
    //   (error) => {
    //     if (
    //       error.code === 'ECONNABORTED' &&
    //       error.message.includes('timeout')
    //     ) {
    //       // 超时处理
    //       return Promise.reject(new Error('Request timeout'));
    //     }
    //     return Promise.reject(error);
    //   },
    // );
  }

  public async call(
    requestClient: JsonRpcRequestClient,
    reqOptions?: AxiosRequestConfig,
  ): Promise<JsonRpcResponse> {
    try {
      const { req, url } = requestClient;
      const request: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: !req.isNotify ? uuidv4() : null,
        method: req.method,
        params: req.params,
      };
      // console.log('request', request, url, reqOptions);
      // 如果是通知类请求，则直接发送请求并返回
      if (req.isNotify) {
        this.sendNotification(request, url, reqOptions);
        return;
      }
      const response = await this.sendRequest(request, url, reqOptions);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 发送通知类请求的方法
  private async sendNotification(
    request: JsonRpcRequest,
    url: string,
    reqOptions?: AxiosRequestConfig,
  ): Promise<void> {
    await this.axiosInstance.post(url, request, reqOptions);
  }

  private async sendRequest(
    request: JsonRpcRequest,
    url: string,
    reqOptions?: AxiosRequestConfig,
  ): Promise<JsonRpcResponse> {
    const response = await this.axiosInstance.post(url, request, reqOptions);
    return response.data;
  }
}
