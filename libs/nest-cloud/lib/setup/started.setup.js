"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const nacos_naming_1 = require("../nacos.naming");
const nest_common_1 = require("@cs/nest-common");
class StartedStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const serverPrefix = this.configService.get('serverPath');
        const logger = this.app.get(nest_common_1.LoggerService);
        const docsPath = serverPrefix ? `${serverPrefix}/docs` : 'docs';
        if (Number(process.env.CS_PORT) > 0) {
            await this.app.listen(Number(process.env.CS_PORT));
            let startOutput = `\n- service ${process.env.CS_NAME} is ready now! \n- service access address: http://${process.env.CS_HOST}:${Number(process.env.CS_PORT)}/${process.env.CS_SERVERPATH} \n`;
            if (this.configService.isConfig('docs')) {
                startOutput += `- service document access address: http://${process.env.CS_HOST}:${Number(process.env.CS_PORT)}/${docsPath}`;
            }
            logger.log(startOutput);
        }
        else {
            logger.error('service start port not specified!');
        }
        if (this.configService.isConfig('naming')) {
            await (0, nacos_naming_1.registerService)();
        }
    }
}
exports.StartedStrategy = StartedStrategy;
//# sourceMappingURL=started.setup.js.map