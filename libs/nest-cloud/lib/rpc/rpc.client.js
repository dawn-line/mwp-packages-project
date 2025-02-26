"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcClient = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("./json-rpc/client");
const rpc_interface_1 = require("./rpc.interface");
const rpc_errors_1 = require("./rpc.errors");
const nacos_naming_1 = require("../nacos.naming");
let RpcClient = class RpcClient {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger('RpcService');
        this.client = new client_1.JsonRpcClient({
            protocol: options.protocol,
            timeout: options.timeout || 60000,
        });
        this.nacosNaming = this.initNacosNaming();
    }
    async call(request) {
        const { rpcConfig, payload, reqOptions } = request;
        const instance = await this.getHealthyInstance(rpcConfig);
        let url = `${this.options.protocol}://${instance.ip}:${instance.port}`;
        if (rpcConfig.servicePath) {
            url += `/${rpcConfig.servicePath}/rpc`;
        }
        else {
            url += '/rpc';
        }
        try {
            return this.client.call({
                url,
                req: payload,
            }, reqOptions);
        }
        catch (error) {
            if (error instanceof rpc_errors_1.RpcException) {
                throw error;
            }
            throw new rpc_errors_1.RpcInternalException('Failed to call RPC service', {
                originalError: error.message,
                stack: error.stack,
            });
        }
    }
    initNacosNaming() {
        const nacosName = process.env.CS_NACOSNAME;
        const nacosPassword = process.env.CS_NACOSPASSWORD;
        const namespace = process.env.CS_SERVICEENV;
        const nacosServerIp = process.env.CS_NACOSSERVERIP;
        return nacos_naming_1.NacosNaming.getInstance({
            logger: console,
            serverList: nacosServerIp,
            namespace: namespace,
            username: nacosName,
            password: nacosPassword,
        });
    }
    async getHealthyInstance(config) {
        try {
            const instance = await this.nacosNaming.selectOneHealthyInstance(config.serviceName, config.groupName, config.clusters);
            if (!instance) {
                throw new Error(`No healthy instance found for service: ${config.serviceName}`);
            }
            return instance;
        }
        catch (error) {
            throw new Error(`Failed to get healthy instance: ${error.message}`);
        }
    }
};
exports.RpcClient = RpcClient;
exports.RpcClient = RpcClient = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rpc_interface_1.RPC_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], RpcClient);
//# sourceMappingURL=rpc.client.js.map