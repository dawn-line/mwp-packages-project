"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipesStrategy = void 0;
const setup_interface_1 = require("./setup.interface");
const common_1 = require("@nestjs/common");
class PipesStrategy extends setup_interface_1.SetupStrategy {
    async execute() {
        const config = this.configService.get('validationPipe');
        if (this.configService.isConfig('validationPipe')) {
            this.app.useGlobalPipes(new common_1.ValidationPipe({
                ...config,
                errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
            }));
        }
    }
}
exports.PipesStrategy = PipesStrategy;
//# sourceMappingURL=pipes.setup.js.map