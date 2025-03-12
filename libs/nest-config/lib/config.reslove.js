"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resloveConfig = void 0;
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const config_default_1 = require("./config/config.default");
const config_env_1 = require("./config/config.env");
const logger = new common_1.Logger('ConfigInitialize');
const resloveConfig = (options, remoteConfig) => {
    try {
        const { onlyLocal, configFilePath } = options;
        let currentConfig;
        const localConfig = readLocalFile(configFilePath);
        let profilesActive = '';
        if (!process.env.CS_SERVICEENV) {
            process.env.CS_SERVICEENV = 'dev';
        }
        if (localConfig) {
            profilesActive = localConfig.application['profiles.active'] || '';
        }
        if (onlyLocal) {
            currentConfig = (0, lodash_1.defaultsDeep)(localConfig.application, localConfig[`profiles.${profilesActive.split(',')[0]}`], config_default_1.defaultConfig);
        }
        else {
            const coverConfig = remoteConfig['applicationCover'];
            const appConfig = remoteConfig['application'].application;
            const serverConfig = remoteConfig.serviceConfig || {};
            if ((process.env.CS_SERVICEENV === 'dev' ||
                process.env.CS_SERVICEENV === 'beat') &&
                localConfig) {
                const envArr = profilesActive.split(',');
                let envConfig = {};
                envArr.forEach((item) => {
                    if (item === 'dev' || item === 'beat') {
                        envConfig = (0, lodash_1.defaultsDeep)(envConfig, serverConfig.application);
                    }
                    else {
                        envConfig = (0, lodash_1.defaultsDeep)(localConfig[`profiles.${item}`], envConfig);
                    }
                });
                currentConfig = (0, lodash_1.defaultsDeep)(localConfig.application || {}, envConfig, appConfig, config_default_1.defaultConfig);
            }
            else {
                currentConfig = (0, lodash_1.defaultsDeep)(serverConfig.application, appConfig, config_default_1.defaultConfig);
            }
            currentConfig = coverConfigFn(currentConfig, coverConfig);
        }
        convertType(currentConfig);
        read2Env(currentConfig);
        logger.log('Configuration file loaded successfully!');
        return currentConfig;
    }
    catch (e) {
        logger.error('Parse configuration exception:' + e);
        throw new Error(e);
    }
};
exports.resloveConfig = resloveConfig;
const coverConfigFn = (config, coverConfig) => {
    for (const key in config) {
        switch (key) {
            case 'mysql':
                for (const ikey in config[key]) {
                    config[key][ikey] = (0, lodash_1.defaultsDeep)(coverConfig[key], config[key][ikey]);
                }
                break;
            default:
                break;
        }
        if (key.indexOf('profiles.') > -1) {
            delete config[key];
        }
    }
    return config;
};
const readLocalFile = (filePath) => {
    filePath = (0, path_1.resolve)(process.cwd(), filePath);
    if ((0, fs_1.existsSync)(filePath)) {
        return (0, js_yaml_1.load)((0, fs_1.readFileSync)(filePath, 'utf8'));
    }
};
const convertType = (config) => {
    for (const key in config) {
        if (typeof config[key] === 'number') {
            config[key] = Number(config[key]);
        }
        if (typeof config[key] === 'boolean') {
            config[key] = Boolean(config[key]);
        }
    }
};
const read2Env = (config) => {
    for (const key in config_env_1.defaultEnvConfig) {
        if (Object.prototype.hasOwnProperty.call(config_env_1.defaultEnvConfig, key)) {
            if (typeof config_env_1.defaultEnvConfig[key] === 'object') {
                for (const ikey in config_env_1.defaultEnvConfig[key]) {
                    const objectConfig = config[key] || config_env_1.defaultEnvConfig[key];
                    process.env[`CS_${key.toUpperCase()}_${ikey.toUpperCase()}`] =
                        objectConfig[ikey];
                }
            }
            else {
                process.env[`CS_${key.toUpperCase()}`] =
                    config[key] || config_env_1.defaultEnvConfig[key];
            }
        }
    }
};
//# sourceMappingURL=config.reslove.js.map