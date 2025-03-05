import { JsonRpcResponse, JsonRpcSuccessResponse, JSONRPCErrorResponse } from './types';
export declare function isJsonRpcResponse(response: JsonRpcResponse | void): response is JsonRpcResponse;
export declare function isJsonRpcSuccessResponse(response: JsonRpcResponse): response is JsonRpcSuccessResponse;
export declare function isJsonRpcErrorResponse(response: JsonRpcResponse): response is JSONRPCErrorResponse;
export declare function getRPCResult<T>(response: JsonRpcResponse | void): T | null;
//# sourceMappingURL=rpc-helpers.d.ts.map