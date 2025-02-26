"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJsonRpcRequest = validateJsonRpcRequest;
exports.createJsonRpcSuccess = createJsonRpcSuccess;
exports.createJsonRpcError = createJsonRpcError;
const rpc_errors_1 = require("../rpc.errors");
const ALLOWED_REQUEST_MEMBERS = new Set(['jsonrpc', 'method', 'params', 'id']);
function isValidParam(param) {
    const validTypes = ['string', 'number', 'boolean', 'object', 'undefined'];
    if (param === null)
        return true;
    if (validTypes.includes(typeof param)) {
        if (typeof param === 'object') {
            return (Array.isArray(param) ||
                Object.getPrototypeOf(param) === Object.prototype);
        }
        return true;
    }
    return false;
}
function hasExtraMembers(request) {
    return Object.keys(request).some((key) => !ALLOWED_REQUEST_MEMBERS.has(key));
}
function throwError(request, error, message) {
    request.id = null;
    throw new error(message);
}
function validateJsonRpcRequest(request) {
    if (!request || typeof request !== 'object') {
        throwError(request, rpc_errors_1.RpcInvalidRequestException, 'Request must be an object');
    }
    if (hasExtraMembers(request)) {
        throwError(request, rpc_errors_1.RpcInvalidRequestException, 'Contains unrecognized members. Only jsonrpc, method, params, and id are allowed');
    }
    if (request.jsonrpc !== '2.0') {
        throwError(request, rpc_errors_1.RpcInvalidRequestException, 'Unsupported JSON-RPC version');
    }
    if (typeof request.method !== 'string' || request.method.trim() === '') {
        throwError(request, rpc_errors_1.RpcInvalidRequestException, 'Method must be a non-empty string');
    }
    if (request.params !== undefined) {
        if (isValidParam(request.params)) {
            return;
        }
        throwError(request, rpc_errors_1.RpcInvalidParamsException, 'Params must be primitive type, object, or array');
    }
    if (request.id !== undefined && request.id !== null) {
        if (!(typeof request.id === 'string' || typeof request.id === 'number')) {
            throwError(request, rpc_errors_1.RpcInvalidRequestException, 'ID must be a string, number, or null');
        }
    }
}
function createJsonRpcSuccess(id, result) {
    return {
        jsonrpc: '2.0',
        result,
        id: id || null,
    };
}
function createJsonRpcError(id, code, message, data) {
    return {
        jsonrpc: '2.0',
        error: {
            code,
            message,
            data,
        },
        id: id || null,
    };
}
//# sourceMappingURL=utils.js.map