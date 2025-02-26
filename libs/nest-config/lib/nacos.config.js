"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NacosConfig = void 0;
const nacos_1 = require("nacos");
const common_1 = require("@nestjs/common");
class NacosConfig {
    constructor(nacosOptions) {
        this.initConfig = () => {
            this.configClient = new nacos_1.NacosConfigClient(this.config);
        };
        this.getNacosConfig = async (dataId, groupId, options) => {
            let config = null;
            if (dataId && groupId) {
                config = await this.configClient.getConfig(dataId, groupId, options);
            }
            else {
                this.logger.error('获取nacos配置参数信息缺失！');
            }
            return config;
        };
        this.subscribeNacosConfig = async (dataId, groupId, callFn) => {
            this.configClient.subscribe({
                dataId,
                groupId,
            }, callFn);
            this.logger.log('nacos配置服务启用监听！');
        };
        this.config = nacosOptions;
        this.logger = new common_1.Logger('ConfigInitialize');
        this.initConfig();
    }
}
exports.NacosConfig = NacosConfig;
//# sourceMappingURL=nacos.config.js.map