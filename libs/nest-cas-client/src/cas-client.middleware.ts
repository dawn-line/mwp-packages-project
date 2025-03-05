import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@cs/nest-common';
import { CasClientService } from './cas-client.service';
import { CasOptions } from './cas-options.interface';
import { CAS_CLIENT_MODULE_OPTIONS } from './cas-client.constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class CasClientMiddleware implements NestMiddleware {
  constructor(
    @Inject(CAS_CLIENT_MODULE_OPTIONS)
    private readonly options: CasOptions,
    private readonly casClient: CasClientService,
  ) {}

  private getFullUrl(req: Request): string {
    const protocol = req.protocol;
    const host = req.get('host');
    const path = req.baseUrl;
    return `${protocol}://${host}${path}`;
  }

  private async isUserLoggedIn(uid: string): Promise<boolean> {
    // 判断用户登录
    const sessionId = `mwp:${uid}`;
    // 集成第三方时考虑
    const userInfo = await this.casClient.getSessionInfo(sessionId);
    return !!userInfo.result;
  }

  private async handleTicketValidation(
    ticket: string,
    fullUrl: string,
    req: Request,
    res: Response,
  ) {
    // 1. 验证 ST 并获取用户信息
    const user = await this.casClient.validateTicket(ticket, fullUrl);

    // 2. 将用户信息存储到 session 中
    this.setUserToSession(user, req);

    // 3. 设置 session cookie
    this.setSessionCookie(res, user);

    // 4. 清理 URL 中的 ticket 参数，避免后续请求带上 ST
    const cleanUrl = this.removeTicketFromUrl(fullUrl);

    // 5. 重定向到清理过的 URL
    return res.redirect(cleanUrl);
  }

  private async setUserToSession(user: any, req: Request) {
    const sessionId = `mwp:${user.userId}`;
    await this.casClient.setSessionInfo(sessionId, user);
    // 考虑是否写入请求上下文
    req.user = user;
  }

  private setSessionCookie(res: Response, user: any) {
    const userId = user.userId;
    if (userId) {
      res.cookie('__casuid', userId, {
        httpOnly: true, // 设置 HttpOnly 以防止 JavaScript 访问
        secure: false, // 生产环境使用 secure cookie
        maxAge: 1 * 60 * 60 * 1000, // 设置 cookie 的过期时间
      });
    }
  }

  private redirectToLogin(res: Response, fullUrl: string) {
    const loginUrl = this.casClient.getLoginUrl(fullUrl);
    // console.log('CAS Middleware - redirecting to login:', loginUrl);
    return res.redirect(loginUrl);
  }

  private async handleTgtValidation(
    tgt: string,
    fullUrl: string,
    req: Request,
    res: Response,
  ) {
    // 1. 使用 TGT 获取 Service Ticket
    const st = await this.casClient.getServiceTicket(tgt, fullUrl);
    console.log('CAS Middleware - st:', st);
    // 2. 验证 ST 并获取用户信息
    const user = await this.casClient.validateTicket(st, fullUrl);
    console.log('CAS Middleware - user:', user);
    // 3. 将用户信息存储到 session 中
    await this.setUserToSession(user, req);

    // 4. 设置 session cookie（例如 JSESSIONID 或其他自定义名称）
    this.setSessionCookie(res, user);

    // 5. 重定向到带有票据的清理过的 URL
    const cleanUrl = this.removeTicketFromUrl(fullUrl);
    return res.redirect(cleanUrl);
  }

  // 私有方法，用于从 URL 中删除 ticket 参数
  private removeTicketFromUrl(url: string): string {
    // 使用 URL 对象来解析和修改 URL
    const urlObj = new URL(url);

    // 删除 URL 中的 ticket 参数
    urlObj.searchParams.delete('ticket');

    return urlObj.toString();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // const session = req.session;
    const fullUrl = this.getFullUrl(req);
    try {
      console.log('CAS Middleware - fullUrl:', fullUrl);
      // 1. 如果 session 中已存在用户信息，直接放行
      const casuid = req.cookies?.['__casuid'];
      if (casuid) {
        const isLogin = await this.isUserLoggedIn(casuid);
        if (isLogin) {
          return next();
        }
      }
      console.log('CAS Middleware - no user in session');
      // 2. 检查 URL 中是否带有 ST 票据
      const ticket = req.query.ticket as string;
      // console.log('CAS Middleware - ticket:', ticket);
      if (ticket) {
        await this.handleTicketValidation(ticket, fullUrl, req, res);
        return;
      }
      console.log('CAS Middleware - no ticket in url');
      // 3. 检查 cookie 中是否有 TGT
      const tgt = req.cookies?.['__tgc'];
      console.log('CAS Middleware - __tgc:', tgt);
      if (tgt) {
        await this.handleTgtValidation(tgt, fullUrl, req, res);
        return;
      }
      console.log('CAS Middleware - no __tgc in cookie');
      // 4. 如果以上都不满足，则重定向到 CAS 登录页
      this.redirectToLogin(res, fullUrl);
    } catch (error) {
      // console.error('CAS Middleware - error:', error);
      this.redirectToLogin(res, fullUrl);
    }
  }
}
