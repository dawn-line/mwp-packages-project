"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const config_service_1 = require("./config.service");
const constants_1 = require("./config/constants");
const config_utlis_1 = require("./config.utlis");
class ConfigModule {
    static async forRoot(options, isGlobal = true) {
        const configData = await (0, config_utlis_1.getRemoteConfig)(options);
        const configService = new config_service_1.ConfigService(configData);
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: config_service_1.ConfigService,
                    useValue: configService,
                },
            ],
            global: isGlobal,
            exports: [config_service_1.ConfigService],
        };
    }
    static forRootAsync(options, isGlobal = true) {
        return {
            module: ConfigModule,
            global: isGlobal,
            imports: options.imports,
            providers: [
                {
                    provide: constants_1.CONFIG_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
                config_service_1.ConfigService,
            ],
            exports: [config_service_1.ConfigService, constants_1.CONFIG_OPTIONS],
        };
    }
}
exports.ConfigModule = ConfigModule;
//# sourceMappingURL=config.module.js.map