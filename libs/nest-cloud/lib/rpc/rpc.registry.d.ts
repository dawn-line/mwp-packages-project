import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
export interface RpcServiceInfo {
    name: string;
    description?: string;
    methods: RpcMethodInfo[];
}
export interface RpcMethodInfo {
    name: string;
    description?: string;
    returnType?: string;
    returnDescription?: string;
    parameters: RpcParameterInfo[];
    fullName: string;
}
export interface RpcParameterInfo {
    name: string;
    description?: string;
    type?: string;
    required?: boolean;
    defaultValue?: any;
    position: number;
}
export declare class RpcRegistry implements OnModuleInit {
    private readonly discoveryService;
    private readonly metadataScanner;
    private rpcMethods;
    private servicesInfo;
    constructor(discoveryService: DiscoveryService, metadataScanner: MetadataScanner);
    onModuleInit(): Promise<void>;
    executeMethod(method: string, params: any): Promise<any>;
    private buildMethodArguments;
    getMethods(): string[];
    getServicesInfo(): RpcServiceInfo[];
}
//# sourceMappingURL=rpc.registry.d.ts.map