"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcService = RpcService;
exports.RpcMethod = RpcMethod;
exports.RpcParam = RpcParam;
require("reflect-metadata");
const rpc_interface_1 = require("./rpc.interface");
function RpcService(options) {
    return (target) => {
        const serviceOptions = typeof options === 'string' ? { name: options } : options;
        Reflect.defineMetadata(rpc_interface_1.RPC_SERVICE_METADATA, serviceOptions, target);
    };
}
function RpcMethod(options) {
    return (target, propertyKey, descriptor) => {
        const methodOptions = options;
        Reflect.defineMetadata(rpc_interface_1.RPC_METHOD_METADATA, {
            name: methodOptions.name || propertyKey.toString(),
            originalMethod: propertyKey.toString(),
            description: methodOptions.description,
            returnType: methodOptions.returnType,
            returnDescription: methodOptions.returnDescription,
        }, descriptor.value);
        return descriptor;
    };
}
function RpcParam(options) {
    return (target, propertyKey, parameterIndex) => {
        const paramOptions = typeof options === 'string' ? { name: options } : options;
        const existingParams = Reflect.getMetadata(rpc_interface_1.RPC_PARAMS_METADATA, target, propertyKey) || {};
        existingParams[parameterIndex] = paramOptions;
        Reflect.defineMetadata(rpc_interface_1.RPC_PARAMS_METADATA, existingParams, target, propertyKey);
    };
}
//# sourceMappingURL=rpc.decorators.js.map