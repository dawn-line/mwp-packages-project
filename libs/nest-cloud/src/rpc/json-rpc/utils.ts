import { JsonRpcResponse, JSONRPCID, JSONValue } from './types';
import {
  RpcInvalidRequestException,
  RpcInvalidParamsException,
} from '../rpc.errors';

interface ValidationResult {
  isValid: boolean;
  error?: JsonRpcResponse;
}
const ALLOWED_REQUEST_MEMBERS = new Set(['jsonrpc', 'method', 'params', 'id']);

function isValidParam(param: any): boolean {
  const validTypes = ['string', 'number', 'boolean', 'object', 'undefined'];

  if (param === null) return true;

  if (validTypes.includes(typeof param)) {
    if (typeof param === 'object') {
      return (
        Array.isArray(param) ||
        Object.getPrototypeOf(param) === Object.prototype
      );
    }
    return true;
  }

  return false;
}

function hasExtraMembers(request: any): boolean {
  return Object.keys(request).some((key) => !ALLOWED_REQUEST_MEMBERS.has(key));
}

function throwError(
  request: any,
  error: typeof RpcInvalidRequestException | typeof RpcInvalidParamsException,
  message: string,
): never {
  // 在抛出异常前重置请求的 id
  request.id = null;
  throw new error(message);
}

export function validateJsonRpcRequest(request: any): ValidationResult {
  // 基础结构验证
  if (!request || typeof request !== 'object') {
    throwError(
      request,
      RpcInvalidRequestException,
      'Request must be an object',
    );
  }

  // 检查是否有额外的成员
  if (hasExtraMembers(request)) {
    throwError(
      request,
      RpcInvalidRequestException,
      'Contains unrecognized members. Only jsonrpc, method, params, and id are allowed',
    );
  }

  // 验证 jsonrpc 版本
  if (request.jsonrpc !== '2.0') {
    throwError(
      request,
      RpcInvalidRequestException,
      'Unsupported JSON-RPC version',
    );
  }

  // 验证方法名
  if (typeof request.method !== 'string' || request.method.trim() === '') {
    throwError(
      request,
      RpcInvalidRequestException,
      'Method must be a non-empty string',
    );
  }

  // 验证参数
  if (request.params !== undefined) {
    // 检查单个参数的情况
    if (isValidParam(request.params)) {
      return;
    }

    throwError(
      request,
      RpcInvalidParamsException,
      'Params must be primitive type, object, or array',
    );
  }

  // 验证 ID
  if (request.id !== undefined && request.id !== null) {
    if (!(typeof request.id === 'string' || typeof request.id === 'number')) {
      throwError(
        request,
        RpcInvalidRequestException,
        'ID must be a string, number, or null',
      );
    }
  }
}

export function createJsonRpcSuccess(
  id: JSONRPCID,
  result: JSONValue,
): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    result,
    id: id || null,
  };
}

export function createJsonRpcError(
  id: JSONRPCID,
  code: number,
  message: string,
  data?: any,
): JsonRpcResponse {
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
