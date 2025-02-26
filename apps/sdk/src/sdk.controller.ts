import { Controller, Get } from '@nestjs/common';
import { SdkService } from './sdk.service';
import OpenAI from 'openai';
@Controller()
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Get()
  async getHello(): Promise<any> {
    console.log('进入控制器:SDK');
    const res = await this.rpcHttpService.get(
      {
        serviceName: 'node-cas-service',
      },
      '/casServer/',
      {
        timeout: 6000,
      },
    );
    return res;
  }

  @Get('getAi')
  async getAi(): Promise<any> {
    const openai = new OpenAI({
      apiKey:
        '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',
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      store: true,
      messages: [{ role: 'user', content: 'write a haiku about ai' }],
    });
    return completion;
  }
}
