"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const core_1 = require("@nestjs/core");
const nest_config_1 = require("@cs/nest-config");
const setup_1 = require("./setup");
async function bootstrap(rootModule, appStartedCall) {
    const app = await core_1.NestFactory.create(rootModule, {
        bufferLogs: true,
    });
    const configService = app.get(nest_config_1.ConfigService);
    for (const key of Object.keys(setup_1.configStrategyMap)) {
        const strategy = new setup_1.configStrategyMap[key](app, configService);
        await strategy.execute();
    }
    if (appStartedCall) {
        await appStartedCall(app, configService);
    }
}
//# sourceMappingURL=app.bootstrap.js.map