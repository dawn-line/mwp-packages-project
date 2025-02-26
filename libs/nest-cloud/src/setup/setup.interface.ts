import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@cs/nest-config';

export class SetupStrategy {
  constructor(protected app: NestExpressApplication, protected configService: ConfigService) {}
  async execute (): Promise<void> {}
}
