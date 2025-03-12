import { NacosConfigClient } from 'nacos';
import { Logger, LoggerService } from '@nestjs/common';

export interface NacosOptions {
  serverAddr: string; // 域名
  namespace: string; //从环境中获取配置
  username: string;
  password: string;
  requestTimeout: number;
}

export class NacosConfig {
  private config: NacosOptions;
  private configClient!: NacosConfigClient;
  private logger: LoggerService;
  constructor(nacosOptions: NacosOptions) {
    this.config = nacosOptions;
    this.logger = new Logger('ConfigInitialize');
    this.initConfig();
  }

  // 获取环境配
  initConfig = () => {
    this.configClient = new NacosConfigClient(this.config);
  };

  // 根据dataID获取配置
  getNacosConfig = async (
    dataId: string,
    groupId: string,
    options?: any,
  ): Promise<any> => {
    let config = null;
    if (dataId && groupId) {
      config = await this.configClient.getConfig(dataId, groupId, options);
    } else {
      this.logger.error('获取nacos配置参数信息缺失！');
    }
    return config;
  };

  // 监听配置
  subscribeNacosConfig = async (
    dataId: string,
    groupId: string,
    callFn: Promise<void>,
  ) => {
    this.configClient.subscribe(
      {
        dataId,
        groupId,
      },
      callFn,
    );
    this.logger.log('nacos配置服务启用监听！');
  };
}
