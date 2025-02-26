import { JsonRpcResponse, JSONRPCID, JSONValue } from './types';
interface ValidationResult {
    isValid: boolean;
    error?: JsonRpcResponse;
}
export declare function validateJsonRpcRequest(request: any): ValidationResult;
export declare function createJsonRpcSuccess(id: JSONRPCID, result: JSONValue): JsonRpcResponse;
export declare function createJsonRpcError(id: JSONRPCID, code: number, message: string, data?: any): JsonRpcResponse;
export {};
//# sourceMappingURL=utils.d.ts.map