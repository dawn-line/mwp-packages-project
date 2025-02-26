"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcInternalException = exports.RpcInvalidParamsException = exports.RpcMethodNotFoundException = exports.RpcInvalidRequestException = exports.RpcParseException = exports.RpcException = void 0;
const types_1 = require("./json-rpc/types");
class RpcException extends Error {
    constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
        this.name = 'RpcException';
    }
}
exports.RpcException = RpcException;
class RpcParseException extends RpcException {
    constructor(data) {
        super('Parse error', types_1.RpcErrorCode.PARSE_ERROR, data);
        this.name = 'RpcParseException';
    }
}
exports.RpcParseException = RpcParseException;
class RpcInvalidRequestException extends RpcException {
    constructor(data) {
        super('Invalid request', types_1.RpcErrorCode.INVALID_REQUEST, data);
        this.name = 'RpcInvalidRequestException';
    }
}
exports.RpcInvalidRequestException = RpcInvalidRequestException;
class RpcMethodNotFoundException extends RpcException {
    constructor(method, data) {
        super(`Method not found: ${method}`, types_1.RpcErrorCode.METHOD_NOT_FOUND, data);
        this.name = 'RpcMethodNotFoundException';
    }
}
exports.RpcMethodNotFoundException = RpcMethodNotFoundException;
class RpcInvalidParamsException extends RpcException {
    constructor(message = 'Invalid params', data) {
        super(message, types_1.RpcErrorCode.INVALID_PARAMS, data);
        this.name = 'RpcInvalidParamsException';
    }
}
exports.RpcInvalidParamsException = RpcInvalidParamsException;
class RpcInternalException extends RpcException {
    constructor(message = 'Internal error', data) {
        super(message, types_1.RpcErrorCode.INTERNAL_ERROR, data);
        this.name = 'RpcInternalException';
    }
}
exports.RpcInternalException = RpcInternalException;
//# sourceMappingURL=rpc.errors.js.map