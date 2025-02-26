"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptorsStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const nest_common_1 = require("@cs/nest-common");
const components_1 = require("../components");
class InterceptorsStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const logger = this.app.get(nest_common_1.LoggerService);
        if (this.configService.isConfig('loggerInterceptor')) {
            this.app.useGlobalInterceptors(new components_1.LoggingInterceptor(this.configService, logger));
        }
        if (this.configService.isConfig('transformInterceptor')) {
            this.app.useGlobalInterceptors(new components_1.TransformInterceptor());
        }
    }
}
exports.InterceptorsStrategy = InterceptorsStrategy;
//# sourceMappingURL=interceptors.setup.js.map