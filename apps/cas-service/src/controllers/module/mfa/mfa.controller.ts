import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MFAService } from './mfa.service';

@Controller('cas/v1/mfa')
export class MFAController {
  constructor(private readonly mfaService: MFAService) {}

  /**
   * 请求进行多因素认证
   * POST /cas/v1/mfa/request
   */
  @Post('request')
  @HttpCode(HttpStatus.OK)
  requestMFA(@Body() body: any) {
    return this.mfaService.requestMFA(body);
  }

  /**
   * 验证多因素认证结果
   * POST /cas/v1/mfa/verify
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyMFA(@Body() body: any) {
    return this.mfaService.verifyMFA(body);
  }
}
