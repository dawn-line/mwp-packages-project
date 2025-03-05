"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonRpcResponse = isJsonRpcResponse;
exports.isJsonRpcSuccessResponse = isJsonRpcSuccessResponse;
exports.isJsonRpcErrorResponse = isJsonRpcErrorResponse;
exports.getRPCResult = getRPCResult;
function isJsonRpcResponse(response) {
    return response !== undefined && response !== null;
}
function isJsonRpcSuccessResponse(response) {
    return 'result' in response;
}
function isJsonRpcErrorResponse(response) {
    return 'error' in response;
}
function getRPCResult(response) {
    if (!isJsonRpcResponse(response) || !isJsonRpcSuccessResponse(response)) {
        return null;
    }
    return response.result;
}
//# sourceMappingURL=rpc-helpers.js.map