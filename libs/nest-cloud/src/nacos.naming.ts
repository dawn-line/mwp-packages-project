import { NacosNamingClient, NacosNamingClientConfig, Host } from 'nacos';
import { Logger, LoggerService } from '@nestjs/common';
import { CommonUtil } from '@cs/nest-common';
import { error } from 'console';
// import { resolve } from 'path';
// import { readFileSync } from 'fs';

interface Instance {
  instanceId: string;
  ip: string; //IP of instance
  port: number; //Port of instance
  healthy: boolean;
  enabled: boolean;
  serviceName?: string;
  weight?: number;
  ephemeral?: boolean;
  clusterName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SubscribeInfo {
  serviceName: string;
  groupName?: string;
  clusters?: string;
}

export class NacosNaming {
  private static instance: NacosNaming;
  private config: NacosNamingClientConfig;
  private namingClient: NacosNamingClient;
  private logger: LoggerService;
  constructor(nacosOptions: NacosNamingClientConfig) {
    this.config = nacosOptions;
    this.logger = new Logger('NamingRegisting');
    this.initConfig();
  }

  // 获取环境配
  initConfig = () => {
    this.namingClient = new NacosNamingClient(this.config);
  };

  public static getInstance(config: NacosNamingClientConfig): NacosNaming {
    if (!NacosNaming.instance) {
      NacosNaming.instance = new NacosNaming(config);
    }
    return NacosNaming.instance;
  }

  ready = async () => {
    await this.namingClient.ready();
  };

  // 注册服务实例
  registerInstance = async (
    serviceName: string,
    instance: Instance,
    groupName?: string,
  ): Promise<void> => {
    if (!groupName) groupName = 'DEFAULT_GROUP';
    if (serviceName) {
      await this.namingClient.registerInstance(
        serviceName,
        instance,
        groupName,
      );
      this.logger.log(
        `The service ${serviceName} successfully went online to the registry!`,
      );
    } else {
      this.logger.error('The service name cannot be empty!');
    }
  };

  // 订阅服务
  // subscribe = (
  //   info: SubscribeInfo | string, //service info, if type is string, it's the serviceName
  //   listener: (host: Host[]) => void,
  // ) => {
  //   this.namingClient.subscribe(info, listener);
  // };

  // 获取健康实例
  selectOneHealthyInstance = async (
    serviceName: string,
    groupName?: string,
    clusters?: string,
  ): Promise<Host | undefined> => {
    await this.ready(); //待客户端预备好后
    const instances = await this.namingClient.selectInstances(
      serviceName,
      groupName,
      clusters,
      true,
    );
    let totalWeight = 0;
    for (const instance of instances) {
      totalWeight += instance.weight;
    }
    let pos = Math.random() * totalWeight;
    for (const instance of instances) {
      if (instance.weight) {
        pos -= instance.weight;
        if (pos <= 0) {
          return instance as Host;
        }
      }
    }
  };
}

// 实例注册
export const registerService = async () => {
  // const packagePath = resolve(process.cwd(), './package.json');
  // const serviceName = JSON.parse(readFileSync(packagePath).toString()).name;
  const nacosName = process.env.CS_NACOSNAME;
  const nacosPassword = process.env.CS_NACOSPASSWORD;
  const namespace = process.env.CS_SERVICEENV;
  const nacosServerIp = process.env.CS_NACOSSERVERIP;

  const nacosNamingClient = NacosNaming.getInstance({
    logger: console,
    serverList: nacosServerIp, // 域名
    namespace: namespace, //从环境中获取配置
    username: nacosName,
    password: nacosPassword,
  });

  // 注册实例
  await nacosNamingClient.ready();

  // 准备实例参数
  const instance: Instance = {
    serviceName: process.env.CS_NAME,
    weight: 1,
    enabled: true,
    healthy: true,
    port: Number(process.env.CS_PORT),
    ip: process.env.CS_HOST,
    instanceId: CommonUtil.idGenerate(),
  };
  await nacosNamingClient.registerInstance(instance.serviceName, instance);
};
