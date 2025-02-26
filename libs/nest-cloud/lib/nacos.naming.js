"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = exports.NacosNaming = void 0;
const nacos_1 = require("nacos");
const common_1 = require("@nestjs/common");
const nest_common_1 = require("@cs/nest-common");
class NacosNaming {
    constructor(nacosOptions) {
        this.initConfig = () => {
            this.namingClient = new nacos_1.NacosNamingClient(this.config);
        };
        this.ready = async () => {
            await this.namingClient.ready();
        };
        this.registerInstance = async (serviceName, instance, groupName) => {
            if (!groupName)
                groupName = 'DEFAULT_GROUP';
            if (serviceName) {
                await this.namingClient.registerInstance(serviceName, instance, groupName);
                this.logger.log(`The service ${serviceName} successfully went online to the registry!`);
            }
            else {
                this.logger.error('The service name cannot be empty!');
            }
        };
        this.selectOneHealthyInstance = async (serviceName, groupName, clusters) => {
            await this.ready();
            const instances = await this.namingClient.selectInstances(serviceName, groupName, clusters, true);
            let totalWeight = 0;
            for (const instance of instances) {
                totalWeight += instance.weight;
            }
            let pos = Math.random() * totalWeight;
            for (const instance of instances) {
                if (instance.weight) {
                    pos -= instance.weight;
                    if (pos <= 0) {
                        return instance;
                    }
                }
            }
        };
        this.config = nacosOptions;
        this.logger = new common_1.Logger('NamingRegisting');
        this.initConfig();
    }
    static getInstance(config) {
        if (!NacosNaming.instance) {
            NacosNaming.instance = new NacosNaming(config);
        }
        return NacosNaming.instance;
    }
}
exports.NacosNaming = NacosNaming;
const registerService = async () => {
    const nacosName = process.env.CS_NACOSNAME;
    const nacosPassword = process.env.CS_NACOSPASSWORD;
    const namespace = process.env.CS_SERVICEENV;
    const nacosServerIp = process.env.CS_NACOSSERVERIP;
    const nacosNamingClient = NacosNaming.getInstance({
        logger: console,
        serverList: nacosServerIp,
        namespace: namespace,
        username: nacosName,
        password: nacosPassword,
    });
    await nacosNamingClient.ready();
    const instance = {
        serviceName: process.env.CS_NAME,
        weight: 1,
        enabled: true,
        healthy: true,
        port: Number(process.env.CS_PORT),
        ip: process.env.CS_HOST,
        instanceId: nest_common_1.CommonUtil.idGenerate(),
    };
    await nacosNamingClient.registerInstance(instance.serviceName, instance);
};
exports.registerService = registerService;
//# sourceMappingURL=nacos.naming.js.map