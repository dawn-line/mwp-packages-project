import { RpcErrorCode } from './json-rpc/types';
export class RpcException extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly data?: any,
  ) {
    super(message);
    this.name = 'RpcException';
  }
}

export class RpcParseException extends RpcException {
  constructor(data?: any) {
    super('Parse error', RpcErrorCode.PARSE_ERROR, data);
    this.name = 'RpcParseException';
  }
}

export class RpcInvalidRequestException extends RpcException {
  constructor(data?: any) {
    super('Invalid request', RpcErrorCode.INVALID_REQUEST, data);
    this.name = 'RpcInvalidRequestException';
  }
}

export class RpcMethodNotFoundException extends RpcException {
  constructor(method: string, data?: any) {
    super(`Method not found: ${method}`, RpcErrorCode.METHOD_NOT_FOUND, data);
    this.name = 'RpcMethodNotFoundException';
  }
}

export class RpcInvalidParamsException extends RpcException {
  constructor(message = 'Invalid params', data?: any) {
    super(message, RpcErrorCode.INVALID_PARAMS, data);
    this.name = 'RpcInvalidParamsException';
  }
}

export class RpcInternalException extends RpcException {
  constructor(message = 'Internal error', data?: any) {
    super(message, RpcErrorCode.INTERNAL_ERROR, data);
    this.name = 'RpcInternalException';
  }
}
