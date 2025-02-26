"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerConfigStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const nest_common_1 = require("@cs/nest-common");
class LoggerConfigStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const logger = this.app.get(nest_common_1.LoggerService);
        this.app.useLogger(logger);
        if (this.configService.isConfig('disableConsole')) {
            nest_common_1.CommonUtil.disableConsole();
        }
    }
}
exports.LoggerConfigStrategy = LoggerConfigStrategy;
//# sourceMappingURL=logger.setup.js.map