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
exports.UnifiedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nest_common_1 = require("@cs/nest-common");
const nest_config_1 = require("@cs/nest-config");
const rpc_1 = require("../../rpc");
let UnifiedExceptionFilter = class UnifiedExceptionFilter {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
    }
    isHttpException(exception) {
        return (exception instanceof common_1.HttpException ||
            (exception?.constructor?.name === 'HttpException' &&
                typeof exception.getStatus === 'function'));
    }
    getErrorMessage(exceptionResponse) {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        if (typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse) {
            const message = exceptionResponse.message;
            return Array.isArray(message) ? message[0] : message;
        }
        return 'Internal server error';
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const config = this.configService.get('exceptionFilter');
        const includeStack = config?.stack?.response || false;
        if (exception instanceof rpc_1.RpcException) {
            this.logger.error({
                jsonrpc: '2.0',
                error: {
                    code: exception.code,
                    message: exception.message,
                    data: {
                        type: 'RPC_ERROR',
                        method: request.body?.method,
                        params: request.body?.params,
                        ...exception.data,
                        ...(includeStack ? { stack: exception.stack } : {}),
                    },
                    id: null,
                },
            }, 'RpcExceptionFilter');
            const errorResponse = {
                jsonrpc: '2.0',
                error: {
                    code: exception.code,
                    message: exception.message,
                    data: {
                        ...exception.data,
                        ...(includeStack ? { stack: exception.stack } : {}),
                    },
                },
                id: null,
            };
            return response.status(common_1.HttpStatus.OK).json(errorResponse);
        }
        if (this.isHttpException(exception)) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (status === common_1.HttpStatus.FOUND &&
                typeof exceptionResponse === 'object' &&
                'redirectUrl' in exceptionResponse) {
                return response.redirect(exceptionResponse.redirectUrl);
            }
            const errorResponse = {
                code: status,
                message: this.getErrorMessage(exceptionResponse),
                path: request.url,
                timestamp: new Date().toISOString(),
            };
            if (includeStack) {
                errorResponse.stack = exception.stack;
            }
            if (config?.stack?.logger) {
                this.logger.error({
                    ...errorResponse,
                    stack: exception.stack,
                }, 'HttpExceptionFilter');
            }
            else {
                this.logger.error(errorResponse, 'HttpExceptionFilter');
            }
            return response.status(status).json(errorResponse);
        }
        const errorResponse = {
            code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: exception instanceof Error
                ? exception.message
                : 'Internal server error',
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        if (includeStack && exception instanceof Error) {
            errorResponse.stack = exception.stack;
        }
        if (config?.stack?.logger) {
            this.logger.error({
                ...errorResponse,
                stack: exception instanceof Error ? exception.stack : undefined,
            }, 'ExceptionFilter');
        }
        else {
            this.logger.error(errorResponse, 'ExceptionFilter');
        }
        return response
            .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};
exports.UnifiedExceptionFilter = UnifiedExceptionFilter;
exports.UnifiedExceptionFilter = UnifiedExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [nest_config_1.ConfigService,
        nest_common_1.LoggerService])
], UnifiedExceptionFilter);
//# sourceMappingURL=exception.filter.js.map