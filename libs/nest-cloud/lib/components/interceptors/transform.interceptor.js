"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const nest_common_1 = require("@cs/nest-common");
const class_validator_1 = require("class-validator");
let TransformInterceptor = class TransformInterceptor {
    constructor() {
        this.reflector = new core_1.Reflector();
    }
    intercept(context, next) {
        const isSkipIntercept = this.reflector.get(nest_common_1.SKIP_TRANSFORM_INTERCEPTOR, context.getHandler());
        if (isSkipIntercept) {
            return next.handle().pipe((0, operators_1.map)((data) => data));
        }
        const request = context.switchToHttp().getRequest();
        const isRpcRequest = request.headers['x-rpc-request'] === 'true';
        if (isRpcRequest) {
            return next.handle();
        }
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            let message = '';
            if ((0, class_validator_1.isObject)(data)) {
                message = data.message;
            }
            const result = {
                code: response.statusCode,
                status: nest_common_1.EHttpStatus.Success,
                message,
                result: data !== undefined ? data : null,
            };
            return result;
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map