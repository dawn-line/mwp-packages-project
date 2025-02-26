import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('cas/v1/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * 生成访问令牌
   * POST /cas/v1/token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createToken(@Body() body: any) {
    return this.tokenService.createToken(body);
  }

  /**
   * 撤销访问令牌
   * POST /cas/v1/token/revoke
   */
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  revokeToken(@Body() body: any) {
    return this.tokenService.revokeToken(body);
  }

  /**
   * 检查令牌的有效性
   * GET /cas/v1/token/introspect?token=xxx
   */
  @Get('introspect')
  @HttpCode(HttpStatus.OK)
  introspectToken(@Query('token') token: string) {
    return this.tokenService.introspectToken(token);
  }
}
