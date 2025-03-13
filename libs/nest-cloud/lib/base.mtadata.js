"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSModule = CSModule;
const common_1 = require("@nestjs/common");
const nest_config_1 = require("@cs/nest-config");
const nest_common_1 = require("@cs/nest-common");
const rpc_module_1 = require("./rpc/rpc.module");
function CSModule(sharedMetaData, configOption) {
    const metadata = {
        imports: [
            nest_config_1.ConfigModule.forRoot(Object.assign({
                configFilePath: './dist/config.yaml',
                onlyLocal: false,
                configFrom: 'nacos',
            }, configOption || {})),
            nest_common_1.LoggerModule.forRootAsync({
                inject: [nest_config_1.ConfigService],
                useFactory: async (config) => {
                    return {
                        ...config.get('logger'),
                    };
                },
            }, true),
            rpc_module_1.RpcModule.forRootAsync({
                inject: [nest_config_1.ConfigService],
                useFactory: async (config) => {
                    return {
                        ...config.get('rpc'),
                    };
                },
            }, true),
        ],
        providers: [],
        controllers: [],
        exports: [nest_common_1.LoggerModule, rpc_module_1.RpcModule, nest_config_1.ConfigModule],
    };
    for (const key in sharedMetaData) {
        metadata[key].push(...sharedMetaData[key]);
    }
    return (0, common_1.Module)(metadata);
}
//# sourceMappingURL=base.mtadata.js.map