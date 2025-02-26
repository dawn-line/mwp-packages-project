"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const nest_common_1 = require("@cs/nest-common");
const nest_config_1 = require("@cs/nest-config");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }
    intercept(context, next) {
        const loggerInterceptor = this.config.get('loggerInterceptor');
        if (!loggerInterceptor) {
            return next.handle();
        }
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        const { method, url } = request;
        const handler = context.getHandler().name;
        const controller = context.getClass().name;
        const requestDetails = {
            method,
            url,
            handler,
            controller,
            ...(loggerInterceptor.moreInfo && {
                headers: request.headers,
                query: request.query,
                params: request.params,
                body: request.body,
            }),
        };
        this.logger.verbose(`>>>>>> Incoming Request: ${JSON.stringify(requestDetails)}`);
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)((data) => {
            const responseTime = Date.now() - now;
            const responseDetails = {
                method,
                url,
                responseTime: `${responseTime}ms`,
                ...(loggerInterceptor.moreInfo && {
                    statusCode: response.statusCode,
                    responseBody: data,
                }),
            };
            this.logger.verbose(`<<<<<<Outgoing Response: ${JSON.stringify(responseDetails)}`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nest_config_1.ConfigService,
        nest_common_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map