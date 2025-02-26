"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMac = exports.getRemoteConfig = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const os = __importStar(require("os"));
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
const nacos_config_1 = require("./nacos.config");
const config_reslove_1 = require("./config.reslove");
const nacos_constants_1 = require("./nacos.constants");
const logger = new common_1.Logger('ConfigInitialize');
const getRemoteConfig = async function (configOption, strategyType = 'nacos') {
    const configStrategy = configStrategies[strategyType];
    if (configStrategy) {
        const remoteConfig = await configStrategy();
        if (remoteConfig) {
            if (!configOption.configFilePath) {
                configOption.configFilePath = `./dist/config.yaml`;
            }
            return (0, config_reslove_1.resloveConfig)(configOption, remoteConfig);
        }
        else {
            logger.error('远程配置获取为null,请检查配置是否正常！');
        }
    }
    else {
        logger.log('不支持当前类型的配置方式！');
    }
};
exports.getRemoteConfig = getRemoteConfig;
const fromNacosStrategy = async () => {
    try {
        let config = null;
        const packagePath = (0, path_1.resolve)(process.cwd(), './package.json');
        const serviceName = JSON.parse((0, fs_1.readFileSync)(packagePath).toString()).name;
        const nacosName = process.env.CS_NACOSNAME || nacos_constants_1.NACOS_NAME;
        const nacosPassword = process.env.CS_NACOSPASSWORD || nacos_constants_1.NACOS_PASSWORD;
        const namespace = process.env.CS_SERVICEENV || nacos_constants_1.NACOS_NAMESPACE;
        const serverAddr = process.env.CS_NACOSSERVERIP;
        process.env.CS_NACOSNAME = nacosName;
        process.env.CS_NACOSPASSWORD = nacosPassword;
        const nacosConfigClient = new nacos_config_1.NacosConfig({
            serverAddr: serverAddr,
            namespace: namespace,
            username: nacosName,
            password: nacosPassword,
            requestTimeout: 6000,
        });
        if (serviceName) {
            const serviceConfig = await nacosConfigClient.getNacosConfig(serviceName, 'DEFAULT_GROUP');
            const application = await nacosConfigClient.getNacosConfig('.application', 'DEFAULT_GROUP');
            const applicationCover = await nacosConfigClient.getNacosConfig('.application-cover', 'DEFAULT_GROUP');
            config = {
                application: (0, js_yaml_1.load)(application),
                applicationCover: (0, js_yaml_1.load)(applicationCover),
                serviceConfig: (0, js_yaml_1.load)(serviceConfig),
            };
        }
        else {
            throw new common_1.HttpException('未获取到serviceName', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return config;
    }
    catch (error) {
        throw new common_1.HttpException('获取配置异常！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
const fromGiteaStrategy = async () => {
    try {
        const packagePath = (0, path_1.resolve)(process.cwd(), './package.json');
        const serviceName = JSON.parse((0, fs_1.readFileSync)(packagePath).toString()).name;
        const mac = (0, exports.getMac)();
        let env = 'dev';
        if (process.env.CS_SERVICEENV) {
            env = process.env.CS_SERVICEENV;
        }
        const result = await axios_1.default.get(`giteaServer/getServiceConfig?path=${serviceName}.yaml&flag=${mac}&env=${env}`, {
            baseURL: 'http://gitea.files:8090',
        });
        if (result.data && result.data.status === 'success') {
            const config = {
                application: result.data.result['application.yaml'],
                applicationCover: result.data.result['application-cover.yaml'],
                serviceConfig: result.data.result[`${serviceName}.yaml`],
            };
            return config;
        }
        else {
            throw new common_1.HttpException('获取远程配置失败！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    catch (error) {
        throw new common_1.HttpException('获取配置异常！', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
const configStrategies = {
    gitea: fromGiteaStrategy,
    nacos: fromNacosStrategy,
};
const getMac = () => {
    const interfaces = os.networkInterfaces();
    for (const dev in interfaces) {
        const iface = interfaces[dev];
        if (!iface)
            continue;
        for (let index = 0; index < iface.length; index++) {
            const alias = iface[index];
            if (alias.family === 'IPv4' &&
                alias.mac &&
                alias.mac !== '00:00:00:00:00:00') {
                return alias.mac;
            }
        }
    }
    return '00:00:00:00:00:00';
};
exports.getMac = getMac;
//# sourceMappingURL=config.utlis.js.map