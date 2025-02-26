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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcRegistry = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rpc_interface_1 = require("./rpc.interface");
const rpc_errors_1 = require("./rpc.errors");
let RpcRegistry = class RpcRegistry {
    constructor(discoveryService, metadataScanner) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.rpcMethods = new Map();
        this.servicesInfo = new Map();
    }
    async onModuleInit() {
        const providers = this.discoveryService.getProviders();
        providers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance)
                return;
            const serviceOptions = Reflect.getMetadata(rpc_interface_1.RPC_SERVICE_METADATA, instance.constructor);
            if (!serviceOptions)
                return;
            const serviceName = serviceOptions.name;
            const serviceInfo = {
                name: serviceName,
                description: serviceOptions.description,
                methods: [],
            };
            this.servicesInfo.set(serviceName, serviceInfo);
            this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (methodName) => {
                const method = instance[methodName];
                const methodMeta = Reflect.getMetadata(rpc_interface_1.RPC_METHOD_METADATA, method);
                if (methodMeta) {
                    const fullMethodName = `${serviceName}.${methodName}`;
                    const prototype = Object.getPrototypeOf(instance);
                    const paramMappings = Reflect.getMetadata(rpc_interface_1.RPC_PARAMS_METADATA, prototype, methodName) ||
                        {};
                    const parametersInfo = [];
                    for (const [index, options] of Object.entries(paramMappings)) {
                        const paramIndex = Number(index);
                        parametersInfo.push({
                            ...options,
                            position: paramIndex,
                        });
                    }
                    parametersInfo.sort((a, b) => a.position - b.position);
                    const methodInfo = {
                        name: methodMeta.name,
                        description: methodMeta.description,
                        returnType: methodMeta.returnType,
                        returnDescription: methodMeta.returnDescription,
                        parameters: parametersInfo,
                        fullName: fullMethodName,
                    };
                    serviceInfo.methods.push(methodInfo);
                    this.rpcMethods.set(fullMethodName, {
                        instance,
                        methodName,
                        methodInfo,
                    });
                }
            });
        });
    }
    async executeMethod(method, params) {
        const methodData = this.rpcMethods.get(method);
        if (!methodData) {
            throw new rpc_errors_1.RpcMethodNotFoundException(method);
        }
        const { instance, methodName, methodInfo } = methodData;
        try {
            const args = this.buildMethodArguments(params, methodInfo);
            const result = instance[methodName](...args);
            if (result && typeof result.then === 'function') {
                return await result;
            }
            return result;
        }
        catch (error) {
            if (error instanceof rpc_errors_1.RpcException) {
                throw error;
            }
            if (error.message?.includes('Invalid parameters') ||
                error.message?.includes('Type error')) {
                throw new rpc_errors_1.RpcInvalidParamsException(error.message);
            }
            throw new rpc_errors_1.RpcInternalException('Method execution failed', {
                originalError: error.message,
                stack: error.stack,
            });
        }
    }
    buildMethodArguments(params, methodInfo) {
        try {
            if (params === null || params === undefined) {
                const requiredParam = methodInfo.parameters.find((p) => p.required);
                if (requiredParam) {
                    throw new Error(`Missing required parameter: ${requiredParam.name}`);
                }
                return [];
            }
            if (Array.isArray(params)) {
                if (params.length > methodInfo.parameters.length) {
                    throw new Error('Too many parameters provided');
                }
                const args = [...params];
                for (let i = params.length; i < methodInfo.parameters.length; i++) {
                    const param = methodInfo.parameters[i];
                    if (param.required) {
                        throw new Error(`Missing required parameter: ${param.name}`);
                    }
                    if ('defaultValue' in param) {
                        args[i] = param.defaultValue;
                    }
                }
                return args;
            }
            if (typeof params === 'object') {
                const args = Array(methodInfo.parameters.length).fill(undefined);
                for (const param of methodInfo.parameters) {
                    if (param.name in params) {
                        args[param.position] = params[param.name];
                    }
                    else if (param.required) {
                        throw new Error(`Missing required parameter: ${param.name}`);
                    }
                    else if ('defaultValue' in param) {
                        args[param.position] = param.defaultValue;
                    }
                }
                return args;
            }
            if (methodInfo.parameters.length === 0) {
                throw new Error('No parameters expected but received one');
            }
            return [params];
        }
        catch (error) {
            throw new rpc_errors_1.RpcInvalidParamsException(error.message);
        }
    }
    getMethods() {
        return Array.from(this.rpcMethods.keys());
    }
    getServicesInfo() {
        return Array.from(this.servicesInfo.values());
    }
};
exports.RpcRegistry = RpcRegistry;
exports.RpcRegistry = RpcRegistry = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner])
], RpcRegistry);
//# sourceMappingURL=rpc.registry.js.map