import { EnvConfig } from './config.schema.interface';
import * as os from 'os';

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (iface) {
      for (const alias of iface) {
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
  return 'localhost';
};

export const defaultEnvConfig: EnvConfig = {
  host: getLocalIP() || '127.0.0.1',
  port: 8080,
  name: 'nest-app-server',
  serverPath: '',
  env: 'dev',
  docs: {
    name: '文档标题',
    describe: '文档描述',
    version: 1.0,
  },
  ipIntercept: false, // 白名单拦截
  innerServer: '', // 内部服务调用跳过验证配置
  cors: {
    // 跨域设置
    enable: false,
    address: '*',
  },
};
