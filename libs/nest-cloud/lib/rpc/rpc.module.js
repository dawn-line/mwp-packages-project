"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RpcModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rpc_interface_1 = require("./rpc.interface");
const rpc_controller_1 = require("./rpc.controller");
const rpc_registry_1 = require("./rpc.registry");
const rpc_client_1 = require("./rpc.client");
let RpcModule = RpcModule_1 = class RpcModule {
    static forRoot(options, isGlobal = false) {
        return {
            global: isGlobal,
            module: RpcModule_1,
            imports: [core_1.DiscoveryModule],
            providers: [
                rpc_registry_1.RpcRegistry,
                rpc_client_1.RpcClient,
                {
                    provide: rpc_interface_1.RPC_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
            controllers: [rpc_controller_1.RpcController],
            exports: [rpc_interface_1.RPC_MODULE_OPTIONS, rpc_registry_1.RpcRegistry, rpc_client_1.RpcClient],
        };
    }
    static forRootAsync(options, isGlobal = false) {
        return {
            global: isGlobal,
            module: RpcModule_1,
            imports: [...(options.imports || []), core_1.DiscoveryModule],
            providers: [
                rpc_registry_1.RpcRegistry,
                rpc_client_1.RpcClient,
                {
                    provide: rpc_interface_1.RPC_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
            ],
            controllers: [rpc_controller_1.RpcController],
            exports: [rpc_interface_1.RPC_MODULE_OPTIONS, rpc_registry_1.RpcRegistry, rpc_client_1.RpcClient],
        };
    }
};
exports.RpcModule = RpcModule;
exports.RpcModule = RpcModule = RpcModule_1 = __decorate([
    (0, common_1.Module)({})
], RpcModule);
//# sourceMappingURL=rpc.module.js.map