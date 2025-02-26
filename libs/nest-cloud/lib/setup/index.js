"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configStrategyMap = void 0;
const logger_setup_1 = require("./logger.setup");
const middleware_setup_1 = require("./middleware.setup");
const interceptors_setup_1 = require("./interceptors.setup");
const pipes_setup_1 = require("./pipes.setup");
const filter_setup_1 = require("./filter.setup");
const bodyParser_setup_1 = require("./bodyParser.setup");
const swagger_setup_1 = require("./swagger.setup");
const started_setup_1 = require("./started.setup");
exports.configStrategyMap = {
    logger: logger_setup_1.LoggerConfigStrategy,
    middlewareStrategy: middleware_setup_1.MiddlewareStrategy,
    interceptorsStrategy: interceptors_setup_1.InterceptorsStrategy,
    pipesStrategy: pipes_setup_1.PipesStrategy,
    filterStrategy: filter_setup_1.FilterStrategy,
    bodyParser: bodyParser_setup_1.BodyParserStrategy,
    docs: swagger_setup_1.SwaggerStrategy,
    started: started_setup_1.StartedStrategy,
};
//# sourceMappingURL=index.js.map