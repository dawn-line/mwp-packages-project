// src/auth/ticket/ticket.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '@cs/nest-common';
import { ConfigService } from '@cs/nest-config';
import { RedisService } from '@cs/nest-redis';
import { v4 as uuidv4 } from 'uuid';
import { RpcMethod, RpcService, RpcParam } from '@cs/nest-cloud';
import { TGT, PT, ST } from './tickets.dto';
import { normalizeServiceUrl, isServiceMatch } from '../auth.utils';
@Injectable()
@RpcService({
  name: 'ticket',
  description: '票据管理',
})
export class TicketService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  // 有效期配置（单位：毫秒）
  private readonly TGT_EXPIRATION = this.config.get('cas').tgt || 12 * 60 * 60; // 12小时
  private readonly ST_EXPIRATION = this.config.get('cas').st || 5 * 60; // 5分钟
  private readonly PT_EXPIRATION = this.config.get('cas').pt || 5 * 60; // 5分钟

  /**
   * 创建新的 Ticket-Granting Ticket (TGT)
   * @param userId 用户id
   */
  async createTGT(userId: bigint): Promise<string> {
    const id = `TGT-${uuidv4()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.TGT_EXPIRATION);
    const tgt: TGT = { id, userId, createdAt: now, expiresAt };
    if (!userId) {
      throw new HttpException('Invalid userId', HttpStatus.UNAUTHORIZED);
    }
    await this.redisService
      .getRedis()
      .setex(`CAS_TICKET_TGT:${id}`, this.TGT_EXPIRATION, JSON.stringify(tgt));
    return id;
  }

  /**
   * 验证 TGT
   */
  async validateTGT(tgtId: string): Promise<TGT> {
    const data = await this.redisService
      .getRedis()
      .get(`CAS_TICKET_TGT:${tgtId}`);
    if (!data) {
      throw new HttpException(
        'Invalid or expired TGT',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tgt: TGT = JSON.parse(data);
    return tgt;
  }

  /**
   * 创建 ST
   */
  @RpcMethod({
    name: 'createST',
    description: '创建St',
  })
  async createST(
    @RpcParam('tgtId') tgtId: string,
    @RpcParam('service') service: string,
    @RpcParam('isFromRenew') isFromRenew = false,
  ): Promise<string> {
    // 检查service非空和合法性
    // const isValidService = await this.validateServiceUrl(service);
    // if (!isValidService) {
    //   throw new HttpException('Illegal service!', HttpStatus.UNAUTHORIZED);
    // }

    const tgt = await this.validateTGT(tgtId);
    const id = `ST-${uuidv4()}`;
    // 规范解析
    const normalizedService = normalizeServiceUrl(service);
    const now = new Date();
    const st: ST = {
      id,
      tgtId,
      service: normalizedService,
      userId: tgt.userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.ST_EXPIRATION),
      used: false,
      isFromRenew,
    };
    await this.redisService
      .getRedis()
      .setex(`CAS_TICKET_ST:${id}`, this.ST_EXPIRATION, JSON.stringify(st));
    return id;
  }

  /**
   * 验证 ST
   */
  @RpcMethod({
    name: 'validateST',
    description: '验证ST',
  })
  async validateST(
    @RpcParam('stId') stId: string,
    @RpcParam('service') service: string,
    @RpcParam('renew') renew?: boolean,
  ): Promise<ST> {
    const data = await this.redisService
      .getRedis()
      .get(`CAS_TICKET_ST:${stId}`);
    if (!data) {
      throw new HttpException('Invalid or expired ST', HttpStatus.UNAUTHORIZED);
    }
    const st: ST = JSON.parse(data);
    // 如果要求 renew，检查 ST 是否来自强制认证
    if (renew && !st.isFromRenew) {
      throw new HttpException(
        'Authentication renewal required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (st.used) {
      throw new HttpException(
        'ST has already been used',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!isServiceMatch(st.service, service)) {
      throw new HttpException('Service mismatch', HttpStatus.UNAUTHORIZED);
    }

    // 标记 ST 为已使用
    st.used = true;
    await this.redisService
      .getRedis()
      .setex(`CAS_TICKET_ST:${stId}`, this.ST_EXPIRATION, JSON.stringify(st)); // 重新设置 TTL

    return st;
  }

  /**
   * 创建 PT
   */
  // async createPT(
  //   tgtId: string,
  //   service: string,
  //   proxyChain: string[] = [],
  // ): Promise<string> {
  //   const tgt = await this.validateTGT(tgtId);
  //   const id = `PT-${uuidv4()}`;
  //   const now = new Date();
  //   const pt: PT = {
  //     id,
  //     tgtId,
  //     service,
  //     userId: tgt.userId,
  //     createdAt: now,
  //     expiresAt: new Date(now.getTime() + this.PT_EXPIRATION * 1000),
  //     used: false,
  //     proxyChain,
  //   };
  //   await this.redisService
  //     .getRedis()
  //     .setex(`CAS_TICKET:${id}`, this.PT_EXPIRATION, JSON.stringify(pt));
  //   return id;
  // }

  /**
   * 验证 PT
   */
  // async validatePT(ptId: string, service: string): Promise<PT> {
  //   const data = await this.redisService.getRedis().get(`pt:${ptId}`);
  //   if (!data) {
  //     throw new HttpException('Invalid or expired PT', HttpStatus.UNAUTHORIZED);
  //   }
  //   const pt: PT = JSON.parse(data);
  //   if (pt.used) {
  //     throw new HttpException(
  //       'PT has already been used',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   if (pt.service !== service) {
  //     throw new HttpException('Service mismatch', HttpStatus.UNAUTHORIZED);
  //   }

  //   // 标记 PT 为已使用
  //   pt.used = true;
  //   await this.redisService
  //     .getRedis()
  //     .setex(`CAS_TICKET:${ptId}`, this.PT_EXPIRATION, JSON.stringify(pt)); // 重新设置 TTL

  //   return pt;
  // }

  /**
   * 清理 TGT 和关联的 ST/PT
   */
  async invalidateTGT(tgtId: string): Promise<void> {
    await this.redisService.getRedis().del(`tgt:${tgtId}`);

    // 获取所有 ST 并删除关联的
    const stKeys = await this.redisService.getRedis().keys(`CAS_TICKET_ST:*`);
    for (const key of stKeys) {
      const st: ST = JSON.parse(await this.redisService.getRedis().get(key));
      if (st.tgtId === tgtId) {
        await this.redisService.getRedis().del(key);
      }
    }

    // 获取所有 PT 并删除关联的
    // const ptKeys = await this.redisService.getRedis().keys(`pt:*`);
    // for (const key of ptKeys) {
    //   const pt: PT = JSON.parse(await this.redisService.getRedis().get(key));
    //   if (pt.tgtId === tgtId) {
    //     await this.redisService.getRedis().del(key);
    //   }
    // }
  }
}
