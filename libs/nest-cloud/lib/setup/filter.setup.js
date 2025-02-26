"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const nest_common_1 = require("@cs/nest-common");
const components_1 = require("../components");
class FilterStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const logger = this.app.get(nest_common_1.LoggerService);
        if (this.configService.isConfig('exceptionFilter')) {
            this.app.useGlobalFilters(new components_1.UnifiedExceptionFilter(this.configService, logger));
        }
    }
}
exports.FilterStrategy = FilterStrategy;
//# sourceMappingURL=filter.setup.js.map