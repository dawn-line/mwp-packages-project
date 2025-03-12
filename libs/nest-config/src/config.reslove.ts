import { load } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { defaultsDeep } from 'lodash';
import { resolve } from 'path';
import { Logger } from '@nestjs/common';
import {
  ConfigSchema,
  YamlConfigSchema,
  CoverConfig,
  ConfigOptions,
} from './config/config.schema.interface';
import { defaultConfig } from './config/config.default';
import { defaultEnvConfig } from './config/config.env';

const logger = new Logger('ConfigInitialize');

export const resloveConfig = (
  options: ConfigOptions,
  remoteConfig: any,
): ConfigSchema => {
  try {
    const { onlyLocal, configFilePath } = options;
    let currentConfig: ConfigSchema;
    const localConfig: YamlConfigSchema = readLocalFile(configFilePath);
    let profilesActive = '' as string;
    // 检测给运行环境给默认值
    if (!process.env.CS_SERVICEENV) {
      process.env.CS_SERVICEENV = 'dev';
    }
    // 加载本地文件
    if (localConfig) {
      profilesActive = localConfig.application['profiles.active'] || '';
    }
    // 合并配置
    if (onlyLocal) {
      // 只读本地配置
      currentConfig = defaultsDeep(
        localConfig.application,
        localConfig[`profiles.${profilesActive.split(',')[0]}`], // 本地配置
        defaultConfig, // 系统包默认配置
      );
    } else {
      const coverConfig = remoteConfig['applicationCover'];
      const appConfig = remoteConfig['application'].application;
      const serverConfig: YamlConfigSchema = remoteConfig.serviceConfig || {};
      if (
        (process.env.CS_SERVICEENV === 'dev' ||
          process.env.CS_SERVICEENV === 'beat') &&
        localConfig
      ) {
        // 本地开发环境下
        const envArr = profilesActive.split(',');
        let envConfig = {};
        envArr.forEach((item) => {
          if (item === 'dev' || item === 'beat') {
            envConfig = defaultsDeep(envConfig, serverConfig.application);
          } else {
            envConfig = defaultsDeep(
              localConfig[`profiles.${item}`],
              envConfig,
            );
          }
        });
        // 合并最终结果
        currentConfig = defaultsDeep(
          localConfig.application || {}, // 服务配置
          envConfig,
          appConfig, // 服务默认配置
          defaultConfig, // 系统包默认配置
        );
      } else {
        // 合并配置
        currentConfig = defaultsDeep(
          serverConfig.application, // 服务配置
          appConfig, // 服务默认配置
          defaultConfig, // 系统包默认配置
        );
      }
      // 处理覆盖配置的情况？？
      currentConfig = coverConfigFn(currentConfig, coverConfig);
      // logger.log(currentConfig);
    }
    convertType(currentConfig);
    // 转化配置注入到系统变量
    read2Env(currentConfig);
    // console.log('result', currentConfig);
    logger.log('Configuration file loaded successfully!');
    return currentConfig;
  } catch (e) {
    logger.error('Parse configuration exception:' + e);
    throw new Error(e);
  }
};

const coverConfigFn = (
  config: ConfigSchema,
  coverConfig: CoverConfig,
): ConfigSchema => {
  for (const key in config) {
    // 覆盖cover的配置
    switch (key) {
      case 'mysql':
        // 强制覆盖指定的配置
        for (const ikey in config[key]) {
          config[key][ikey] = defaultsDeep(coverConfig[key], config[key][ikey]);
        }
        break;
      default:
        break;
    }
    // 删除profiles的配置
    if (key.indexOf('profiles.') > -1) {
      delete config[key];
    }
  }
  return config;
};

const readLocalFile = (filePath: string): YamlConfigSchema => {
  filePath = resolve(process.cwd(), filePath);
  if (existsSync(filePath)) {
    return load(readFileSync(filePath, 'utf8')) as YamlConfigSchema;
  }
};

const convertType = (config: ConfigSchema): void => {
  for (const key in config) {
    if (typeof config[key] === 'number') {
      config[key] = Number(config[key]);
    }
    if (typeof config[key] === 'boolean') {
      config[key] = Boolean(config[key]);
    }
  }
};

const read2Env = (config: ConfigSchema): void => {
  //将envConfig成员配置读取到env中；
  for (const key in defaultEnvConfig) {
    if (Object.prototype.hasOwnProperty.call(defaultEnvConfig, key)) {
      if (typeof defaultEnvConfig[key] === 'object') {
        for (const ikey in defaultEnvConfig[key]) {
          const objectConfig = config[key] || defaultEnvConfig[key];
          process.env[`CS_${key.toUpperCase()}_${ikey.toUpperCase()}`] =
            objectConfig[ikey];
        }
      } else {
        process.env[`CS_${key.toUpperCase()}`] =
          config[key] || defaultEnvConfig[key];
      }
    }
  }
};
