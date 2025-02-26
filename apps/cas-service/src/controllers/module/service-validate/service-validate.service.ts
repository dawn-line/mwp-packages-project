import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@cs/nest-common';
import { ConfigService } from '@cs/nest-config';
import {
  RpcMethod,
  RpcService,
  RpcParam,
  RpcException,
  RpcErrorCode,
} from '@cs/nest-cloud';
import { TicketService } from '../ticket/ticket.service';
import { UserDto } from '../auth/dto';
import { getUserList } from '../auth/users';
import { ServiceRule } from '../auth/dto';
import { matchPathPattern } from '../auth.utils';

@Injectable()
@RpcService({
  name: 'service-validate',
  description: '验证服务',
})
export class ServiceValidateService {
  constructor(
    private readonly ticketService: TicketService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  // /**
  //  * 验证 Service Ticket (ST)
  //  * @param st Service Ticket
  //  * @param service 服务 URL
  //  */
  // validateServiceTicket(st: string, service: string) {
  //   const st: ST = this.ticketService.validateST(st, service);
  //   return st;
  // }

  /**
   * 根据用户 ID 获取用户信息
   */
  getUserById(userId: bigint): UserDto {
    console.log(userId);

    const user = getUserList().find((u) => u.userId === userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  // 验证url合法性
  async validateServiceUrl(serviceUrl: string): Promise<boolean> {
    try {
      if (!serviceUrl) {
        return false;
      }
      const url = new URL(serviceUrl);
      // 从配置中获取服务规则列表
      const serviceRules: ServiceRule[] = this.config.get('cas').serviceRules;
      // 遍历所有规则进行匹配
      return serviceRules.some((rule) => {
        // 1. 验证域名
        if (!url.host.endsWith(rule.domain)) {
          return false;
        }
        // 2. 验证协议
        if (rule.protocol && url.protocol !== `${rule.protocol}:`) {
          return false;
        }
        // 3. 验证路径
        if (rule.pathPattern) {
          if (rule.exact) {
            // 精确匹配
            return url.pathname === rule.pathPattern;
          } else {
            // 通配符匹配
            return matchPathPattern(url.pathname, rule.pathPattern);
          }
        }
        return true;
      });
    } catch (error) {
      this.logger.error('Invalid service URL:', error);
      return false;
    }
  }

  // 验证service ticket是否合法
  @RpcMethod({
    name: 'validateServiceTicket',
    description: '验证 Service Ticket (ST)',
    returnType: 'boolean',
    returnDescription: '票据验证结果，true表示有效，false表示无效',
  })
  async validateServiceTicket(
    @RpcParam({
      name: 'ticket',
      description: '服务票据',
      type: 'string',
      required: true,
    })
    ticket: string,
    @RpcParam({
      name: 'service',
      description: '请求服务的URL',
      type: 'string',
      required: true,
    })
    service: string,
    @RpcParam({
      name: 'renew',
      description: '是否强制重新认证',
      type: 'boolean',
      required: false,
      defaultValue: false,
    })
    renew?: boolean,
    // @Query('pgtUrl') pgtUrl?: string,
    @RpcParam({
      name: 'format',
      description: '返回数据格式',
      type: 'string',
      required: false,
      defaultValue: 'JSON',
    })
    format: 'JSON' | 'XML' = 'JSON',
  ) {
    try {
      if (!ticket || !service) {
        throw new RpcException(
          'Missing required parameters',
          RpcErrorCode.UNAUTHORIZED,
        );
      }
      // 验证票据
      const st = await this.ticketService.validateST(ticket, service, renew);
      // 获取用户信息
      const userInfo = this.getUserById(st.userId);
      // 构建成功响应
      return this.buildSuccessResponse(
        {
          user: st.userId,
          attributes: {
            userId: userInfo.userId,
            userName: userInfo.userName,
            userType: userInfo.userType,
            phone: userInfo.phone,
            realName: userInfo.realName,
            authenticatedAt: st.createdAt,
            isFromRenew: st.isFromRenew,
          },
          // pgtIou,
        },
        format,
      );
    } catch (error) {
      // 构建错误响应
      return this.buildErrorResponse(error, format);
    }
  }

  private buildSuccessResponse(
    data: {
      user: bigint;
      attributes: any;
      pgtIou?: string;
    },
    format: string,
  ) {
    if (format === 'JSON') {
      return {
        serviceResponse: {
          authenticationSuccess: {
            user: data.user,
            attributes: data.attributes,
            ...(data.pgtIou && { proxyGrantingTicket: data.pgtIou }),
          },
        },
      };
    }

    // 构建 XML 响应
    let xml = `
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationSuccess>
          <cas:user>${data.user}</cas:user>
          <cas:attributes>`;

    // 添加属性
    for (const [key, value] of Object.entries(data.attributes)) {
      xml += `<cas:${key}>${value}</cas:${key}>`;
    }

    xml += `</cas:attributes>`;

    // 添加 pgtIou（如果存在）
    if (data.pgtIou) {
      xml += `<cas:proxyGrantingTicket>${data.pgtIou}</cas:proxyGrantingTicket>`;
    }

    xml += `
        </cas:authenticationSuccess>
      </cas:serviceResponse>`;

    return xml;
  }

  private buildErrorResponse(error: any, format: string) {
    const errorCode = this.getErrorCode(error);
    const errorMessage = error.message || 'Ticket validation failed';

    if (format === 'JSON') {
      return {
        serviceResponse: {
          authenticationFailure: {
            code: errorCode,
            description: errorMessage,
          },
        },
      };
    }

    return `
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="${errorCode}">
          ${errorMessage}
        </cas:authenticationFailure>
      </cas:serviceResponse>`;
  }

  private getErrorCode(error: any): string {
    if (
      error.message.includes('Invalid or expired ST') ||
      error.message.includes('ST has already been used')
    )
      return 'INVALID_TICKET';
    if (error.message.includes('Service mismatch')) return 'INVALID_SERVICE';
    if (error.message.includes('renewal required'))
      return 'INVALID_TICKET_RENEW';
    return 'INTERNAL_ERROR';
  }
}
