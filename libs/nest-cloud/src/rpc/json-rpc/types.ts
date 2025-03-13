export type JSONRPC = '2.0';
export const JSONRPC: JSONRPC = '2.0';

export type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray
  | null;

export interface JSONObject {
  [key: string]: JSONValue;
}
export type JSONArray = Array<JSONValue>;
export type JSONRPCID = number | string | null;

export interface JsonRpcRequest {
  jsonrpc: JSONRPC;
  method: string;
  params?: JSONValue;
  id?: JSONRPCID;
}

export interface JsonRpcSuccessResponse {
  jsonrpc: JSONRPC;
  result: JSONValue;
  id: JSONRPCID;
}

export interface JSONRPCErrorResponse {
  jsonrpc: JSONRPC;
  error: JSONRPCError;
  id: JSONRPCID;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

export interface JsonRpcResponse {
  jsonrpc: JSONRPC;
  result?: JSONValue;
  error?: JSONRPCError;
  id: JSONRPCID;
}

export interface JSONRPCConfig {
  protocol: string;
  timeout: number;
}

export interface JsonRpcRequestClient {
  url: string;
  req: ExtendedJsonRpcRequest;
}

export interface ExtendedJsonRpcRequest
  extends Pick<JsonRpcRequest, 'method' | 'params'> {
  isNotify?: boolean;
}

export enum RpcErrorCode {
  // Standard JSON-RPC 2.0 error codes
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,

  // Custom error codes (range -32000 to -32099)
  SERVICE_NOT_FOUND = -32000,
  SERVICE_UNAVAILABLE = -32001,
  TIMEOUT_ERROR = -32002,
  VALIDATION_ERROR = -32003,
  UNAUTHORIZED = -32004,
  RATE_LIMIT_EXCEEDED = -32005,
}
