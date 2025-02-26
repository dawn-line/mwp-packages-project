export enum EHttpStatus {
  Error = 'error',
  Success = 'success',
}

// 一些扩展的HTTP状态码
export enum EHttpExtendStatus {
  // RPC服务调用错误
  INTERNAL_RPC_SERVER_ERROR = 508,
  INTERNAL_RPC_SERVER_TIMEOUT = 509,
}
