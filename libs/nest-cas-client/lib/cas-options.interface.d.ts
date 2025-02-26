import { ModuleMetadata } from '@nestjs/common';
export interface CasOptions {
    casServerUrl: string;
    casServiceValidateUrl: string;
    sessionServiceUrl: string;
    serviceUrl: string;
    rejectUnauthorized?: boolean;
}
export interface CasAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => CasOptions | Promise<CasOptions>;
    inject?: any[];
}
//# sourceMappingURL=cas-options.interface.d.ts.map