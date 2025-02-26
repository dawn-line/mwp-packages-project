import { NacosNamingClientConfig, Host } from 'nacos';
interface Instance {
    instanceId: string;
    ip: string;
    port: number;
    healthy: boolean;
    enabled: boolean;
    serviceName?: string;
    weight?: number;
    ephemeral?: boolean;
    clusterName?: string;
}
export declare class NacosNaming {
    private static instance;
    private config;
    private namingClient;
    private logger;
    constructor(nacosOptions: NacosNamingClientConfig);
    initConfig: () => void;
    static getInstance(config: NacosNamingClientConfig): NacosNaming;
    ready: () => Promise<void>;
    registerInstance: (serviceName: string, instance: Instance, groupName?: string) => Promise<void>;
    selectOneHealthyInstance: (serviceName: string, groupName?: string, clusters?: string) => Promise<Host | undefined>;
}
export declare const registerService: () => Promise<void>;
export {};
//# sourceMappingURL=nacos.naming.d.ts.map