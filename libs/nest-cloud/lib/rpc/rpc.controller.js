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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const rpc_registry_1 = require("./rpc.registry");
const utils_1 = require("./json-rpc/utils");
const rpc_errors_1 = require("./rpc.errors");
class JsonRpcRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JSON-RPC版本号',
        example: '2.0',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JsonRpcRequestDto.prototype, "jsonrpc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RPC方法名,<路径>.<方法>',
        example: 'service.method',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JsonRpcRequestDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '请求参数',
        example: { param1: 'value1', param2: 'value2' },
        required: false,
        type: Object,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JsonRpcRequestDto.prototype, "params", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '请求ID',
        example: '1234567890',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], JsonRpcRequestDto.prototype, "id", void 0);
class JsonRpcResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JSON-RPC版本号',
        example: '2.0',
    }),
    __metadata("design:type", String)
], JsonRpcResponseDto.prototype, "jsonrpc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '响应结果',
        example: { data: 'success' },
    }),
    __metadata("design:type", Object)
], JsonRpcResponseDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '错误信息',
        example: {
            code: -32600,
            message: 'Invalid Request',
            data: { details: 'Invalid method parameter' },
        },
    }),
    __metadata("design:type", Object)
], JsonRpcResponseDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '请求ID',
        example: '1234567890',
    }),
    __metadata("design:type", Object)
], JsonRpcResponseDto.prototype, "id", void 0);
let RpcController = class RpcController {
    constructor(rpcRegistry) {
        this.rpcRegistry = rpcRegistry;
    }
    async handleRpcRequest(request) {
        (0, utils_1.validateJsonRpcRequest)(request);
        return await this.handleSingleRequest(request);
    }
    async handleSingleRequest(request) {
        const { method, params, id } = request;
        try {
            if (!method || typeof method !== 'string') {
                throw new rpc_errors_1.RpcInvalidParamsException('Invalid method name');
            }
            const result = await this.rpcRegistry.executeMethod(method, params);
            return (0, utils_1.createJsonRpcSuccess)(id, result);
        }
        catch (error) {
            if (error instanceof rpc_errors_1.RpcException) {
                throw error;
            }
            if (error.message?.includes('Method not found')) {
                throw new rpc_errors_1.RpcMethodNotFoundException(method);
            }
            if (error.message?.includes('Invalid parameters') ||
                error.message?.includes('Validation failed')) {
                throw new rpc_errors_1.RpcInvalidParamsException(error.message);
            }
            throw new rpc_errors_1.RpcInternalException('Internal error occurred', {
                originalError: error.message,
                stack: error.stack,
            });
        }
    }
    getServicesInfo() {
        const services = this.rpcRegistry.getServicesInfo();
        return services;
    }
};
exports.RpcController = RpcController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'RPC 请求控制器',
        description: '处理JSON-RPC 2.0请求,支持方法调用和通知(使用postman等工具调试时，注意请求头部添加x-rpc-request: true标识头)',
    }),
    (0, swagger_1.ApiBody)({
        type: JsonRpcRequestDto,
        description: 'JSON-RPC 2.0请求对象',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '成功返回RPC响应',
        type: JsonRpcResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RpcController.prototype, "handleRpcRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'RPC服务文档信息',
        description: '获取已注册的RPC服务信息，查询测试使用',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], RpcController.prototype, "getServicesInfo", null);
exports.RpcController = RpcController = __decorate([
    (0, common_1.Controller)('rpc'),
    (0, swagger_1.ApiTags)('rpc'),
    __metadata("design:paramtypes", [rpc_registry_1.RpcRegistry])
], RpcController);
//# sourceMappingURL=rpc.controller.js.map