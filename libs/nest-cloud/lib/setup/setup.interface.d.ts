import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@cs/nest-config';
export declare class SetupStrategy {
    protected app: NestExpressApplication;
    protected configService: ConfigService;
    constructor(app: NestExpressApplication, configService: ConfigService);
    execute(): Promise<void>;
}
//# sourceMappingURL=setup.interface.d.ts.map