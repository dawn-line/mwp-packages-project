export interface NacosOptions {
    serverAddr: string;
    namespace: string;
    username: string;
    password: string;
    requestTimeout: number;
}
export declare class NacosConfig {
    private config;
    private configClient;
    private logger;
    constructor(nacosOptions: NacosOptions);
    initConfig: () => void;
    getNacosConfig: (dataId: string, groupId: string, options?: any) => Promise<any>;
    subscribeNacosConfig: (dataId: string, groupId: string, callFn: Promise<void>) => Promise<void>;
}
//# sourceMappingURL=nacos.config.d.ts.map