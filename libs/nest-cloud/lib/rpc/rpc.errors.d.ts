export declare class RpcException extends Error {
    readonly code: number;
    readonly data?: any;
    constructor(message: string, code: number, data?: any);
}
export declare class RpcParseException extends RpcException {
    constructor(data?: any);
}
export declare class RpcInvalidRequestException extends RpcException {
    constructor(data?: any);
}
export declare class RpcMethodNotFoundException extends RpcException {
    constructor(method: string, data?: any);
}
export declare class RpcInvalidParamsException extends RpcException {
    constructor(message?: string, data?: any);
}
export declare class RpcInternalException extends RpcException {
    constructor(message?: string, data?: any);
}
//# sourceMappingURL=rpc.errors.d.ts.map