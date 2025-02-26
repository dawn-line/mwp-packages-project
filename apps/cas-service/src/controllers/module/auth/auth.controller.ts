import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, ImageCaptchaDto } from './dto';
import { AuthService } from './auth.service';
import { TicketService } from '../ticket/ticket.service';
import { ServiceValidateService } from '../service-validate/service-validate.service';
@Controller()
@ApiTags('登录以及注销')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ticketService: TicketService,
    private readonly serviceValidateService: ServiceValidateService,
  ) {}

  private readonly defaultRedirectService = '/cas/home.html'; // 默认跳转的地址

  // @ApiOperation({
  //   summary: '登录页面',
  //   description: '验证跳转路径是否合法，重定向到登录前端界面',
  // })
  // @Get('login')
  // async toLogin(@Query() params) {
  //   // const frontLogin = this.config.get('cas').casFrontPage;
  //   let pageName = 'login.html';
  //   const { service } = params;
  //   // 验证 service URL 的合法性
  //   if (service) {
  //     const isValidService =
  //       await this.serviceValidateService.validateServiceUrl(service);
  //     if (!isValidService) {
  //       // 如果 service 不合法，重定向到前端的错误页面
  //       pageName = `invalid-service.html?service=${encodeURIComponent(service)}`;
  //     } else {
  //       pageName = `login.html?service=${encodeURIComponent(service)}`;
  //     }
  //   }
  //   throw new HttpException(
  //     {
  //       message: '登录页面跳转',
  //       redirectUrl: `${this.frontLogin}/${pageName}`,
  //     },
  //     HttpStatus.FOUND,
  //   );
  // }

  @ApiOperation({ summary: '登录认证' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Query('service') service?: string,
  ) {
    try {
      // 如果提供了service参数，先验证service
      if (service) {
        const isValidService =
          await this.serviceValidateService.validateServiceUrl(service);
        if (!isValidService) {
          throw new HttpException('Illegal service!', HttpStatus.UNAUTHORIZED);
        } else {
          loginDto.service = service;
        }
      }
      // 验证用户凭据
      const tgt = await this.authService.login(loginDto);

      // 设置 HttpOnly Cookie
      response.cookie('__tgc', tgt, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax', // 允许跨站点导航时发送 lax 或 none
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });
      if (!service) {
        // 没有提供service，重定向到默认地址
        return {
          redirectUrl: `${this.defaultRedirectService}`,
        };
      }
      // 如果提供了service，生成ST并重定向
      const st = await this.ticketService.createST(tgt, service);
      return {
        serviceTicket: st,
        redirectUrl: `${service}?ticket=${st}`,
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: '注销' })
  @Post('logout')
  async logout(@Body() body: { tgt: string }) {
    await this.authService.logout(body.tgt);
    return 'Logged out successfully';
  }

  @ApiOperation({ summary: '获取图片验证码' })
  @Get('verifyCode')
  async getVerifyCode(@Query() dto: ImageCaptchaDto) {
    return await this.authService.getVerifyCode(dto);
  }
}
