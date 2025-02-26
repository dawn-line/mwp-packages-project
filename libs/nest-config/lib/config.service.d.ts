import { ConfigSchema } from './config/config.schema.interface';
export declare class ConfigService {
    private config;
    constructor(options: ConfigSchema);
    get(key: string): any;
    isConfig(key: string): boolean;
    getAll(): ConfigSchema;
}
//# sourceMappingURL=config.service.d.ts.map