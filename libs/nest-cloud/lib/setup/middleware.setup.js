"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const cookieParser = require('cookie-parser');
class MiddlewareStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        if (this.configService.isConfig('cors')) {
            const corsConfig = this.configService.get('cors');
            this.app.enableCors(corsConfig);
        }
        this.app.use(cookieParser());
    }
}
exports.MiddlewareStrategy = MiddlewareStrategy;
//# sourceMappingURL=middleware.setup.js.map