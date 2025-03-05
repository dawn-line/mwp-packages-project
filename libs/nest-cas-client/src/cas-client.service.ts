import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { RpcClient, getRPCResult } from '@cs/nest-cloud';
import { CasOptions } from './cas-options.interface';
import { CAS_CLIENT_MODULE_OPTIONS } from './cas-client.constants';
interface ServiceResponse {
  authenticationSuccess?: {
    user: string;
    attributes?: Record<string, any>;
  };
  authenticationFailure?: {
    code: string;
    description: string;
  };
}

@Injectable()
export class CasClientService {
  constructor(
    @Inject(CAS_CLIENT_MODULE_OPTIONS)
    private readonly options: CasOptions,
    private readonly rpcClient: RpcClient,
  ) {}

  async validateTicket(
    ticket: string,
    actualService?: string,
  ): Promise<object> {
    try {
      // const validateUrl = `${this.options.casServiceValidateUrl}/serviceValidate`;

      // 使用实际的service URL
      const service = actualService || this.options.serviceUrl;
      const response = await this.rpcClient.call({
        rpcConfig: {
          serviceName: 'node-pf-cas-service', // 目标服务名称
          servicePath: 'cas',
        },
        payload: {
          method: 'service-validate.validateServiceTicket',
          params: {
            ticket,
            service,
            renew: false,
            format: 'JSON',
          },
        },
      });
      const result = getRPCResult<{
        serviceResponse: ServiceResponse;
      }>(response)?.serviceResponse;
      if (!!result) {
        return {
          userId: result.authenticationSuccess.user,
          attributes: result.authenticationSuccess.attributes,
        };
      }

      const failure = result?.authenticationFailure;
      throw new HttpException(
        failure?.description || 'Invalid ticket',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw error;
    }
  }

  getLoginUrl(actualService?: string): string {
    const service = encodeURIComponent(
      actualService || this.options.serviceUrl,
    );
    const loginUrl = `${this.options.casServerUrl}/login.html?service=${service}`;
    return loginUrl;
  }

  async getServiceTicket(tgt: string, service: string): Promise<string> {
    const response = await this.rpcClient.call({
      rpcConfig: {
        serviceName: 'node-pf-cas-service', // 目标服务名称
        servicePath: 'cas',
      },
      payload: {
        method: 'ticket.createST',
        params: {
          tgtId: tgt,
          service,
        },
      },
    });
    return getRPCResult<string>(response);
    // 抛异常就跳转到登录页面
    throw new HttpException(
      'Failed to get service ticket',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async getSessionInfo(sessionId: string): Promise<any> {
    const response = await this.rpcClient.call({
      rpcConfig: {
        serviceName: 'node-pf-cas-session-service', // 目标服务名称
        servicePath: 'sessionServer',
      },
      payload: {
        method: 'session.getSession',
        params: {
          sessionId,
        },
      },
    });
    return response;
  }

  async setSessionInfo(
    sessionId: string,
    userInfo: Record<string, any>,
  ): Promise<void> {
    await this.rpcClient.call({
      rpcConfig: {
        serviceName: 'node-pf-cas-session-service', // 目标服务名称
        servicePath: 'sessionServer',
      },
      payload: {
        method: 'session.setSession',
        params: {
          sessionId,
          userData: userInfo,
        },
        isNotify: true,
      },
    });
  }
}
