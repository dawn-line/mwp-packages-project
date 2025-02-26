import { Injectable } from '@nestjs/common';
import { RedisService } from '@cs/nest-redis';
import { RpcService, RpcMethod, RpcParam } from '@cs/nest-cloud';
@Injectable()
@RpcService('session')
export class CasSessionService {
  private readonly SESSION_PREFIX = 'cas:session:';
  private readonly SESSION_TTL = 3600; // 1小时过期

  constructor(private readonly redisService: RedisService) {}

  // 保存用户会话
  @RpcMethod('setSession')
  async setSession(
    @RpcParam('sessionId') sessionId: string,
    @RpcParam('userData') userData: any,
  ): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await this.redisService
      .getRedis()
      .set(key, JSON.stringify(userData), 'EX', this.SESSION_TTL);
  }
  // 获取用户会话1
  // 根据sessionId获取session数据
  @RpcMethod('getSession')
  async getSession(@RpcParam('sessionId') sessionId: string): Promise<any> {
    const key = this.SESSION_PREFIX + sessionId;
    const data = await this.redisService.getRedis().get(key);
    return data ? JSON.parse(data) : null;
  }

  // 删除用户会话
  @RpcMethod('deleteSession')
  async deleteSession(@RpcParam('sessionId') sessionId: string): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await this.redisService.getRedis().del(key);
  }

  // 更新会话过期时间
  @RpcMethod('refreshSession')
  async refreshSession(
    @RpcParam('sessionId') sessionId: string,
  ): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await this.redisService.getRedis().expire(key, this.SESSION_TTL);
  }
}
