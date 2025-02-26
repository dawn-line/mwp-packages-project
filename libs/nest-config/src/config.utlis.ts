import { resolve } from 'path';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as os from 'os';
import axios from 'axios';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { NacosConfig } from './nacos.config';
import { resloveConfig } from './config.reslove';
import {
  ConfigSchema,
  ConfigOptions,
  ConfigFrom,
} from './config/config.schema.interface';
import { NACOS_NAME, NACOS_NAMESPACE, NACOS_PASSWORD } from './nacos.constants';

const logger = new Logger('ConfigInitialize');
type ConfigFromStrategy = () => Promise<any>;

export const getRemoteConfig = async function (
  configOption: ConfigOptions,
  strategyType: ConfigFrom = 'nacos',
): Promise<ConfigSchema> {
  const configStrategy = configStrategies[strategyType];
  if (configStrategy) {
    const remoteConfig = await configStrategy();
    if (remoteConfig) {
      // 合并写入环境
      if (!configOption.configFilePath) {
        configOption.configFilePath = `./dist/config.yaml`;
      }
      return resloveConfig(configOption, remoteConfig);
    } else {
      logger.error('远程配置获取为null,请检查配置是否正常！');
    }
  } else {
    logger.log('不支持当前类型的配置方式！');
  }
};

const fromNacosStrategy: ConfigFromStrategy = async (): Promise<any> => {
  try {
    let config = null;
    const packagePath = resolve(process.cwd(), './package.json');
    const serviceName = JSON.parse(readFileSync(packagePath).toString()).name;

    // 从环境变量获取nacos配置,如果没有则使用默认值
    const nacosName = process.env.CS_NACOSNAME || NACOS_NAME;
    const nacosPassword = process.env.CS_NACOSPASSWORD || NACOS_PASSWORD;
    const namespace = process.env.CS_SERVICEENV || NACOS_NAMESPACE;
    const serverAddr = process.env.CS_NACOSSERVERIP;

    // 同步环境变量
    process.env.CS_NACOSNAME = nacosName;
    process.env.CS_NACOSPASSWORD = nacosPassword;

    const nacosConfigClient = new NacosConfig({
      serverAddr: serverAddr, // 域名
      namespace: namespace, //从环境中获取配置
      username: nacosName,
      password: nacosPassword,
      requestTimeout: 6000,
    });
    
    if (serviceName) {
      const serviceConfig = await nacosConfigClient.getNacosConfig(
        serviceName,
        'DEFAULT_GROUP',
      );
      const application = await nacosConfigClient.getNacosConfig(
        '.application',
        'DEFAULT_GROUP',
      );
      const applicationCover = await nacosConfigClient.getNacosConfig(
        '.application-cover',
        'DEFAULT_GROUP',
      );
      config = {
        application: load(application),
        applicationCover: load(applicationCover),
        serviceConfig: load(serviceConfig),
      };
    } else {
      throw new HttpException('未获取到serviceName', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return config;
  } catch (error) {
    throw new HttpException('获取配置异常！', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

const fromGiteaStrategy: ConfigFromStrategy = async (): Promise<any> => {
  try {
    const packagePath = resolve(process.cwd(), './package.json');
    const serviceName = JSON.parse(readFileSync(packagePath).toString()).name;
    const mac = getMac();
    let env = 'dev';
    if (process.env.CS_SERVICEENV) {
      env = process.env.CS_SERVICEENV;
    }
    const result = await axios.get(
      `giteaServer/getServiceConfig?path=${serviceName}.yaml&flag=${mac}&env=${env}`,
      {
        baseURL: 'http://gitea.files:8090',
      },
    );
    if (result.data && result.data.status === 'success') {
      const config = {
        application: result.data.result['application.yaml'],
        applicationCover: result.data.result['application-cover.yaml'],
        serviceConfig: result.data.result[`${serviceName}.yaml`],
      };
      return config;
    } else {
      throw new HttpException('获取远程配置失败！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    throw new HttpException('获取配置异常！', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

const configStrategies: { [key: string]: ConfigFromStrategy } = {
  gitea: fromGiteaStrategy,
  nacos: fromNacosStrategy,
};

export const getMac = (): string => {
  const interfaces = os.networkInterfaces();
  for (const dev in interfaces) {
    const iface = interfaces[dev];
    if (!iface) continue;

    for (let index = 0; index < iface.length; index++) {
      const alias = iface[index];
      if (
        alias.family === 'IPv4' &&
        alias.mac &&
        alias.mac !== '00:00:00:00:00:00'
      ) {
        return alias.mac;
      }
    }
  }
  return '00:00:00:00:00:00';
};
