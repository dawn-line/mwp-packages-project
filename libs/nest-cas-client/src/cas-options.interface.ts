import { ModuleMetadata } from '@nestjs/common';
export interface CasOptions {
  casServerUrl: string; // cas服务登录地址
  casServiceValidateUrl: string; //cas服务验证地址
  sessionServiceUrl: string; //session服务器地址
  serviceUrl: string; //认证成功回调地址
  rejectUnauthorized?: boolean; // true 为启用证书验证
}

export interface CasAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => CasOptions | Promise<CasOptions>;
  inject?: any[];
}
