import { RpcClient } from '@cs/nest-cloud';
import { CasOptions } from './cas-options.interface';
export declare class CasClientService {
    private readonly options;
    private readonly rpcClient;
    constructor(options: CasOptions, rpcClient: RpcClient);
    validateTicket(ticket: string, actualService?: string): Promise<object>;
    getLoginUrl(actualService?: string): string;
    getServiceTicket(tgt: string, service: string): Promise<string>;
    getSessionInfo(sessionId: string): Promise<any>;
    setSessionInfo(sessionId: string, userInfo: object): Promise<void>;
}
//# sourceMappingURL=cas-client.service.d.ts.map