// utils/rpc-helpers.ts
import {
  JsonRpcResponse,
  JsonRpcSuccessResponse,
  JSONRPCErrorResponse,
} from './types';

// 检查响应是否存在（非 void）
export function isJsonRpcResponse(
  response: JsonRpcResponse | void,
): response is JsonRpcResponse {
  return response !== undefined && response !== null;
}

// 检查是否为成功响应
export function isJsonRpcSuccessResponse(
  response: JsonRpcResponse,
): response is JsonRpcSuccessResponse {
  return 'result' in response;
}

// 检查是否为错误响应
export function isJsonRpcErrorResponse(
  response: JsonRpcResponse,
): response is JSONRPCErrorResponse {
  return 'error' in response;
}

// 安全地提取结果并进行类型转换
export function getRPCResult<T>(response: JsonRpcResponse | void): T | null {
  if (!isJsonRpcResponse(response) || !isJsonRpcSuccessResponse(response)) {
    return null;
  }
  return response.result as T;
}
