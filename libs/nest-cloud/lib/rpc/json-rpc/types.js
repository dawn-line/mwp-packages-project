"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcErrorCode = exports.JSONRPC = void 0;
exports.JSONRPC = '2.0';
var RpcErrorCode;
(function (RpcErrorCode) {
    RpcErrorCode[RpcErrorCode["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    RpcErrorCode[RpcErrorCode["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    RpcErrorCode[RpcErrorCode["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    RpcErrorCode[RpcErrorCode["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    RpcErrorCode[RpcErrorCode["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    RpcErrorCode[RpcErrorCode["SERVICE_NOT_FOUND"] = -32000] = "SERVICE_NOT_FOUND";
    RpcErrorCode[RpcErrorCode["SERVICE_UNAVAILABLE"] = -32001] = "SERVICE_UNAVAILABLE";
    RpcErrorCode[RpcErrorCode["TIMEOUT_ERROR"] = -32002] = "TIMEOUT_ERROR";
    RpcErrorCode[RpcErrorCode["VALIDATION_ERROR"] = -32003] = "VALIDATION_ERROR";
    RpcErrorCode[RpcErrorCode["UNAUTHORIZED"] = -32004] = "UNAUTHORIZED";
    RpcErrorCode[RpcErrorCode["RATE_LIMIT_EXCEEDED"] = -32005] = "RATE_LIMIT_EXCEEDED";
})(RpcErrorCode || (exports.RpcErrorCode = RpcErrorCode = {}));
//# sourceMappingURL=types.js.map