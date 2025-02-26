"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const nest_common_1 = require("@cs/nest-common");
class SwaggerStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const serverPrefix = this.configService.get('serverPath');
        if (this.configService.isConfig('serverPath')) {
            this.app.setGlobalPrefix(serverPrefix);
        }
        const docsPath = serverPrefix ? `${serverPrefix}/docs` : 'docs';
        if (this.configService.isConfig('docs')) {
            const docsConfig = this.configService.get('docs');
            docsConfig.serverPrefix = serverPrefix;
            (0, nest_common_1.setupSwagger)(this.app, docsPath, docsConfig);
        }
    }
}
exports.SwaggerStrategy = SwaggerStrategy;
//# sourceMappingURL=swagger.setup.js.map